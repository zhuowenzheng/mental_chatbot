# Deploying the project on localhost

### 1. Clone Repo
```bash
git clone https://github.com/zhuowenzheng/mental_chatbot.git
```
Make sure to have the .gguf checkpoint file downloaded seperately.

### 2. Install Dependencies
```bash
npm i
```
### 3. Run Frontend Service  

   In terminal, run:
```bash
npm run dev
```
### 4. Run Backend Service  

  In another seperate terminal, run:
  ```bash
uvicorn backend.app:app --host 0.0.0.0 --port 8000
```

### 5. Using the Chatbot  

In your browser, go to `http://localhost:3000` and enjoy the LLM mental counseling support!
