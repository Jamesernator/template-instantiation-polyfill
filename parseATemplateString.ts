
function last<T>(array: Array<T>): T {
  return array[array.length - 1]
}

export default function parseATemplateString(string: string): Array<['string' | 'part', string]> {
  if (string.length === 0) {
    return [['string', '']]
  }
  let position = 0
  let beginningPosition = 0
  let state = 'initial'

  let lastCodePoint: null | string = null
  const tokens: Array<['string' | 'part', string]> = []
  let candidateEndingPosition: number = 0

  while (position < string.length) {
    const codePoint = string[position]

    if (state === 'initial' && codePoint === '{' && lastCodePoint !== '\\') {
      state = 'beginCurly'
      candidateEndingPosition = position
    } else if (state === 'beginCurly') {
      if (codePoint === '{' && lastCodePoint !== '\\') {
        state = 'part'
        tokens.push(['string', string.slice(beginningPosition, candidateEndingPosition)])
        beginningPosition = position + 1
      } else {
        state = 'initial'
      }
    } else if (state === 'part' && codePoint === '}' && lastCodePoint !== '\\') {
      state = 'endCurly'
      candidateEndingPosition = position
    } else if (state === 'endCurly') {
      if (codePoint === '}' && lastCodePoint !== '\\') {
        state = 'initial'
        const expression = string.slice(beginningPosition, candidateEndingPosition)
        tokens.push(['part', expression.trim()])
        beginningPosition = position + 1
      } else {
        state = 'part'
      }
    }

    lastCodePoint = codePoint
    position += 1
  }
  if (beginningPosition < string.length) {
    tokens.push(['string', string.slice(beginningPosition)])
  }
  if (tokens.length > 1 && tokens[0][0] === 'string' && tokens[0][1] === '') {
    tokens.shift()
  }
  if (tokens.length > 1 && last(tokens)[0] === 'string' && last(tokens)[1] === '') {
    tokens.pop()
  }
  return tokens
}
