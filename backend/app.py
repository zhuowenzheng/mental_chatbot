from fastapi import FastAPI, Request
from llama_cpp import Llama
from googletrans import Translator
from langdetect import detect



translator = Translator()

app = FastAPI()

# Load the model
llm = Llama(model_path="./Llama-3-Mental-Therapy-Cat-8B.Q8_0.gguf")


@app.post("/chat")
async def chat(request: Request):
    # Get request data
    data = await request.json()
    messages = data.get("messages", [])
    assistant_prompt = next(
        (msg.get("content", "") for msg in messages if msg.get("role") == "system"),
        ""
    )
    
    # Get the last user message
    last_user_message = next(
        (msg.get("content", "") for msg in reversed(messages) if msg.get("role") == "user"),
        ""
    )
    
    # Combine assistant prompt and user message
    combined_message = f"{assistant_prompt} Based on these guidelines, answer your patients inquiry in a brief and precise manner: {last_user_message}"
    
    # Detect user language
    user_language = detect(last_user_message)
    print("User Language:", user_language)
    
    # Translate the combined message to English
    if user_language != "en":
        translated_message = translator.translate(combined_message, src=user_language, dest="en").text
    else:
        translated_message = combined_message

    # Debug log
    print("Translated message:", translated_message)
    
    # Call the model to generate a response
    try:
        response = llm(
            translated_message,
            max_tokens=4096,  # Set the maximum number of tokens to generate
            temperature=0.7,  # Set the temperature parameter
            top_p=0.9         # Set the top_p parameter
        )

        print("Full model response:", response)
        
        # Extract generated content
        generated_text = response["choices"][0]["text"].strip()
        
        if generated_text.endswith("</s>"):
            generated_text = generated_text[:-len("</s>")].strip()
        
        # If the user language is not English, translate the model response back to the user's language
        if user_language != "en":
            generated_text = translator.translate(generated_text, src="en", dest=user_language).text
        
        return {"response": generated_text}

    except Exception as e:
        print("Error generating response:", str(e))
        return {"error": "Failed to generate response"} 