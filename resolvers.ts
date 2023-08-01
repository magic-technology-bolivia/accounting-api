const Task = require('./models/Task')

export const resolvers = {
    Query: {
        hello: () => 'Hello World',
        getAllTasks: async () => {
            const tasks = await Task.find();
            return tasks
        },
        getTask: async (_: any, args: any) => {
            const task = await Task.findById(args.id);
            return task;
        }
    },
    Mutation: {
        createTask: async (_: any, args: any) => {

            //console.log({parent, args, context, info});
            const {title, description} = args;
            const newTask = new Task({title, description});
            await newTask.save();
            console.log(newTask);

            return newTask;
        },
        async deleteTask(_: any, {id}: any){
            await Task.findByIdAndDelete(id);
            return "Task deleted";
        },
        async updateTask(_: any, {task, id}: any){
            const taskUpdated = await Task.findByIdAndUpdate(id, task, {
                $set: task
            },
            {new:true});

            console.log(taskUpdated, id);
            return taskUpdated
        }
    }
}
