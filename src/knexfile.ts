module.exports =  {
  development: {
    client: "sqlite3",
    connection: {
      filename: "database/dev.sqlite3",  
      database:'dev'
    },
    migrations:{
      directory: './migrations'
    },
    useNullAsDefault: true
  },
};
