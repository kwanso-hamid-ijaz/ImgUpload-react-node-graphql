const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// function generateRandomString(length) {
//   var result = "";
//   var characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   var charactersLength = characters.length;
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }

const storeFS = ({ stream, filename }) => {
  const uploadDir = "./public/images";
  const path = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on("error", (error) => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on("error", (error) => reject(error))
      .on("finish", () => resolve({ path }))
  );
};

const typeDefs = gql`
  type File {
    url: String!
  }
  type Query {
    hello: String!
  }
  type Mutation {
    uploadFile(file: Upload!): File!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello World",
  },
  Mutation: {
    uploadFile: async (parent, { file }) => {
      const { filename, mimetype, createReadStream } = await file;
      const stream = createReadStream();
      const pathObj = await storeFS({ stream, filename });
      const fileLocation = pathObj.path;

      return { url: `http://localhost:4000/images/${filename}` };

      // const { ext } = path.parse(filename);
      // const randomName = generateRandomString(12) + ext;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
server.applyMiddleware({ app });

// app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));

app.use(express.static("public"));
app.use(cors());

app.listen({ port: 5000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
});
