import { GraphQLClientProject } from 'apollo-language-server'
import { defaultOperationRegistrySignature } from 'apollo-graphql'

import sha256 from 'hash.js/lib/hash/sha/256'
import { addTypenameToDocument } from 'apollo-utilities'

import { print } from 'graphql/language/printer'
import { sortDefinitions } from './document'

export interface ManifestEntry {
	signature: string
	document: string
	metadata: {
		engineSignature: string
	}
}

export function getOperationManifestFromProject(
	project: GraphQLClientProject,
): ManifestEntry[] {
	const manifest = Object.entries(
		project.mergedOperationsAndFragmentsForService,
	).map(([operationName, operationAST]) => {
		const sorted = sortDefinitions(operationAST)
		const operationASTwithTypename = addTypenameToDocument(sorted)
		const printed = defaultOperationRegistrySignature(
			operationASTwithTypename,
			operationName,
		)
		const signature = sha256()
			.update(print(operationAST))
			.digest('hex')

		return {
			signature,
			document: printed,
			// TODO: unused. Remove or repurpose this field altogether with op. registry 2.0 work.
			// For now, this field is non-nullable on the input type.
			metadata: {
				engineSignature: '',
			},
		}
	})

	return manifest
}
