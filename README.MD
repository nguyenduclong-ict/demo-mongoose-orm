```
git clone https://github.com/nguyenduclong-ict/demo-mongoose-orm.git
yarn
```

```
# Development
cp .env.example .env.dev
# Create mongodb database
# Fill mongodb connection to .env.dev file
NODE_ENV=development
npm run dev

# Build
npm run build

# Production
cp .env.example .env
NODE_ENV=production
npm run build
npm run start
```

### Route

```typescript
# src/api/todo.api.ts

import { todoRepository } from "../entities/todo";
import { Api } from "../helpers/gateway";
import { RequestHandler } from "express";

const makeDoneTodo : RequestHandler = (req, res, next) => {
    res.json('success')
}

export default {
  path: "/todo",
  // generate crud methods for todo entity
  repository: todoRepository,
    // set crud methods
    // default =  ["list","find","findOne","create","bulkCreate","update","updateOne","delete","deleteOne",]
   // middlewares will pass begin of endpoint
  crudMethods: ['list', {name: 'find', middlewares: [] }],
  // middleware pass to router (optionnal)
  middlewares : [],
  // custom routes
  routes : {
    'POST /done' : makeDoneTodo
  },
} as Api;

// example query list todo and populate comments
GET /todo?populates=["comments"]

```

## DEMO

User permission
![mongoose-orm](https://raw.githubusercontent.com/nguyenduclong-ict/demo-mongoose-orm/master/docs/1.png)
![mongoose-orm](https://raw.githubusercontent.com/nguyenduclong-ict/demo-mongoose-orm/master/docs/2.png)
Media library
![mongoose-orm](https://raw.githubusercontent.com/nguyenduclong-ict/demo-mongoose-orm/master/docs/3.png)
![mongoose-orm](https://raw.githubusercontent.com/nguyenduclong-ict/demo-mongoose-orm/master/docs/4.png)
