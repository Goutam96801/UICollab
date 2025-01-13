import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export async function generateCode(prompt, useTailwind) {
  const systemPrompt = useTailwind
    ? "You are a web developer who creates HTML with Tailwind CSS classes. Respond only with the HTML code, no explanations."
    : "You are a web developer who creates HTML and CSS. Respond with both HTML and CSS code, separated by '---CSS---', no explanations."

  const userPrompt = `Create a component for: ${prompt}`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
    })

    const generatedCode = response.choices[0].message.content || ''

    if (useTailwind) {
      return { html: generatedCode, css: '' }
    } else {
      const [html, css] = generatedCode.split('---CSS---')
      return { html: html.trim(), css: css.trim() }
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    throw new Error('Failed to generate code')
  }
}

