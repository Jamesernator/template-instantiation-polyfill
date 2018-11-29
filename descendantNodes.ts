
export default function* descendantNodes(root: Node): IterableIterator<Node> {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL)
  // this also skips the root element
  let currentNode = walker.nextNode()
  while (currentNode !== null) {
    yield currentNode
    currentNode = walker.nextNode()
  }
}