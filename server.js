const express = require('express')
const graphqlHTTP = require('express-graphql')
const graphql = require('graphql')

// anticipating apex up deployment config
const { PORT = 4000 } = process.env

const pets = [
  { id: '0', name: 'Buster', speciesId: '0' },
  { id: '1', name: 'Marley', speciesId: '2' },
  { id: '2', name: 'Tweety', speciesId: '1' }
]
const species = [
  { id: '0', name: 'dog' },
  { id: '1', name: 'bird' },
  { id: '2', name: 'cat' }
]

const speciesType = new graphql.GraphQLObjectType({
  name: 'Species',
  fields: {
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
  }
})

const petType = new graphql.GraphQLObjectType({
  name: 'Pet',
  fields: {
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    species: {
      type: graphql.GraphQLString,
      resolve(pet) {
        let foo = ''
        species.forEach(function(i) {
          if (i.id == pet.speciesId) {
            foo = i.name
          }
        })
        return foo
      }
    }
  }
})

var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    getPets: {
      type: new graphql.GraphQLList(petType),
      resolve() {
        return pets
      }
    },
    getPet: {
      type: petType,
      args: {
        id: { type: graphql.GraphQLInt }
      },
      resolve: (_, {id}) => {
        return pets[id]
      }
    }
  }
})

var schema = new graphql.GraphQLSchema({query: queryType})

const app = express()
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}))
app.listen(PORT)
console.log('Running a GraphQL API server at localhost:'+PORT+'/graphql')
