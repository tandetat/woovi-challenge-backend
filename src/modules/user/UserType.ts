//import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
//import { globalIdField } from 'graphql-relay';
//
//import {
//	connectionArgs,
//	connectionDefinitions,
//	objectIdResolver,
//	timestampResolver,
//	withFilter,
//} from '@entria/graphql-mongo-helpers';
//
//import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
//
//import { GraphQLContext } from '../../graphql/types';
//
//import { AccountType } from '../../modules/account/AccountType';
//
//import { IUser } from './UserModel';
//import { load } from './UserLoader';
//import { AccountLoader } from '../account/AccountLoader';
//
//const UserType = new GraphQLObjectType<IUser, GraphQLContext>({
//	name: 'User',
//	description: 'User data',
//	fields: () => ({
//		id: globalIdField('User'),
//		//...objectIdResolver,
//		name: {
//			type: GraphQLString,
//			resolve: user => user.name,
//		},
//		email: {
//			type: GraphQLString,
//			resolve: user => user.email,
//		},
//		account: {
//			type: new GraphQLNonNull(AccountType),
//			resolve: (user, _, context) => AccountLoader.load(context, user.account),
//		},
//		...timestampResolver,
//	}),
//	interfaces: () => [nodeInterface],
//});
//
//export default UserType;
//
//registerTypeLoader(UserType, load);
//
//export const UserConnection = connectionDefinitions({
//	name: 'User',
//	nodeType: UserType,
//});
