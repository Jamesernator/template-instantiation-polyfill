import TemplateInstance from "./TemplateInstance.js";

export default {
  process(templateInstance: TemplateInstance, state: any) {
    for (const part of templateInstance.attributeParts) {
      if (part.expression in state) {
        part.value = state[part.expression]
      }
    }

    for (const part of templateInstance.nodeParts) {
      if (part.expression in state) {
        const value = state[part.expression]
        if (value == null) {
          part.replace([])
        } else {
          part.value = state[part.expression]
        }
      }
    }
  },
}