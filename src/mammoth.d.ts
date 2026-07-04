declare module 'mammoth' {
  interface MammothMessage {
    type: string
    message: string
  }

  interface MammothResult {
    value: string
    messages: MammothMessage[]
  }

  function convertToHtml(options: { arrayBuffer: ArrayBuffer }): Promise<MammothResult>
  function extractRawText(options: { arrayBuffer: ArrayBuffer }): Promise<MammothResult>
}
