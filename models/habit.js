const db = require ('../dbConfig/init');
const User = require('./User');

class Habit {
    constructor(data, user){
        this.id = data.id;
        this.habit = data.habit_name;
        this.dateComplete = data.data_complete;
        this.period = data.period;
        this.frequency = data.frequency;
        // this.user = {user: user.user_name, path: `users/${data.user_id}`}

    }

    static get all() {
        return new Promise (async (res, rej) => {
            try{
                const habitsData = await db.query(`SELECT * FROM habits;`)
                const habits = habitsData.rows.map(d => new Habit(d))
                res(habits);
            } catch (err){
                rej (`Error retrieving posts: ${err}`)
            }
        })
    }

    static findById (id){
        return new Promise (async(res, rej)=> {
            try{

                let habitsData = await db.query(`SELECT * FROM habits WHERE habits.id = $1;`, [id]);
                let habit = new Post(habitsData.rows[0])

                res(habit);
            }catch(err){
                rej(`Error retrieving post with id ${id}- Error: ${err}`)
            }
        })
    }


    static async create({habit, frequency}){

        return new Promise (async (res, rej) => {
            try{
                let habitData =  await db.query(`INSERT INTO habits (habit_name, frequency) VALUES ($1, $2) RETURNING *;`, [ habit, frequency ]);
                res (habitData.rows[0]);

            } catch(err){
                reject(`Error creating post- Error:${err}`)
            }
        })
    }

    update() {
        return new Promise (async (res, rej) => {
            try{
                let updatedHabitData = await db.query(`UPDATE habits WHERE id = $1 RETURNING *;`,[this.id]);
                let updatedHabit = new Post(updatedHabitData.rows[0])
                res(updatedHabit);
            }catch (err){
                rej(`Error updating post: ${err}`);
            }
        })
    }

    delete() {
        return new Promise (async(res, rej) => {
            try{
                await db.query(`DELETE FROM posts WHERE id = $1;`, [this.id]);
                res('Post was deleted')
            } catch (err){
                rej(`Error deleting post: ${err}`)
            }
        })
    }
}

module.exports = Post;