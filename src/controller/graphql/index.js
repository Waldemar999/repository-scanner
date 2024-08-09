import { Router } from 'express';
import { createHandler } from 'graphql-http/lib/use/express';

import querySchema from '../../schema/schema.js';
import context from '../../context/context.js'

const graphqlRouter = new Router();

graphqlRouter.all('/graphql', createHandler({
    schema: querySchema,
    context: context,
}));

export default graphqlRouter;
