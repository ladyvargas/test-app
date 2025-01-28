export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app',
    logsUri: process.env.MONGODB_LOGS_URI || 'mongodb://localhost:27017/todo-logs'
  },
});