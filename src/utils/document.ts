// import { DocumentNode } from 'graphql'
// @ts-ignore save init time
export const sortDefinitions = (document: DocumentNode) => ({
	...document,
	// @ts-ignore there is a sort property inside
	definitions: document.definitions.sort((a, b) => {
		if (a.name.value < b.name.value) return -1
		if (a.name.value > b.name.value) return 1
		return 0
	}),
})
