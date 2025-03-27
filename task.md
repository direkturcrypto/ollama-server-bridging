saya ingin membuat sebuah tool untuk proxy ollama server, jadi begini
anggap saja ini url nya adalah http://localhost:3000 nahh nantinya ketika di hit end point2 nya ollama maka auto di porting ke request berbeda.

pokok nya semua end point ollama nanti di porting ke api ai api.vikey.ai

tambahkan endpoint /api/tags dengan response list model, ini contoh datanya :
{
  "models": [
    {
      "name": "nomic-embed-text:latest",
      "model": "nomic-embed-text:latest",
      "modified_at": "2025-03-19T14:28:30.563960813+07:00",
      "size": 274302450,
      "digest": "0a109f422b47e3a30ba2b10eca18548e944e8a23073ee3f3e947efcf3c45e59f",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "nomic-bert",
        "families": [
          "nomic-bert"
        ],
        "parameter_size": "137M",
        "quantization_level": "F16"
      }
    },
    {
      "name": "qwen2.5:0.5b",
      "model": "qwen2.5:0.5b",
      "modified_at": "2025-03-09T12:05:00.148005117+07:00",
      "size": 397821319,
      "digest": "a8b0c51577010a279d933d14c2a8ab4b268079d44c5c8830c0a93900f1827c67",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "qwen2",
        "families": [
          "qwen2"
        ],
        "parameter_size": "494.03M",
        "quantization_level": "Q4_K_M"
      }
    },
    {
      "name": "qwen2.5-coder:0.5b",
      "model": "qwen2.5-coder:0.5b",
      "modified_at": "2025-03-08T12:32:08.7244729+07:00",
      "size": 531081760,
      "digest": "d392ed348d5bb7847eaefe3fcb18e5bcc6433aecb68bf61b6e028d87292ab54f",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "qwen2",
        "families": [
          "qwen2"
        ],
        "parameter_size": "494.03M",
        "quantization_level": "Q8_0"
      }
    }
  ]
}

tapi saya ingin membuat listnya hanya :
- deepseek-r1:1.5b
- deepseek-r1:7b
- deepseek-r1:8b
- deepseek-r1:14b
- qwen2.5:7b-instruct-fp16

rules:
- gunakan nodejs
- buat semuanya menggunakan function supaya bisa di reuse lagi
- module nya gunakan axios
- pastikan semua routes ollama server ini ada disini