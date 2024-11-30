import { Message } from "@/types";

export const fetchChatResponse = async (messages: Message[]) => {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const res = await fetch("http://localhost:8000/chat", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: `You are a helpful and joyous mental therapy assistant. Always answer as helpfully and cheerfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content.Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.`,
              },
              ...messages,
            ],
          }),
        });

        if (res.status !== 200) {
          throw new Error("Backend API returned an error");
        }

        const data = await res.json();
        const text = data.response;
        const queue = encoder.encode(text);
        controller.enqueue(queue);
      } catch (e) {
        controller.error(e);
      } finally {
        controller.close();
      }
    },
  });

  return stream;
};
