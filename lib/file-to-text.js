const { default: configuration } = require("./openaiConfig");
const { OpenAI } = require("openai");

const openai = new OpenAI(configuration);

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function imageToText(file, isPdfImage = false) {
  if (!isPdfImage) {
    const base64Image = await readFile(file);
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Do not explain what the image is all about. I want you to return ALL THE TEXT you can found on the image as is. I repeat, I want ALL THE TEXT IN THE IMAGE, this is important.",
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
    });
    return response.choices[0].message.content;
  } else {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Do not explain what the image is all about. I want you to return ALL THE TEXT you can found on the image as is. I repeat, I want ALL THE TEXT IN THE IMAGE, this is important.",
            },
            {
              type: "image_url",
              image_url: {
                url: file,
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
    });
    return response.choices[0].message.content;
  }
}

export default imageToText;
