const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const weatherRoutes = require('./routes/weatherRoutes');


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/weather', weatherRoutes);



const { User, Event } = require('./models');
app.get('/', async (req, res) => {
    try {
      //const user = await User.create({ customer_id: 2, product_id: 12345, quantity:5 });  // test add
      const users = await User.findAll();
      let html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Planner tables</title>
            <style>
              table, th, td {
                border: 1px solid black;
                border-collapse: collapse;
                padding: 5px;
              }
            </style>
          </head>
          <body>
            <h3>Users</h3>
            <table>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>email</th>
                <th>password</th>
              </tr>`;
      users.forEach(item => {
        html += `
              <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.password}</td>
              </tr>`;
      });
      html += `</table>`

      // ----- events
      const events = await Event.findAll();
      html += `</br>
      <h3>Events</h3>
      <table>
      <tr>
                <th>id</th>
                <th>user_id</th>
                <th>name</th>
                <th>description</th>
                <th>start</th>
                <th>end</th>
                <th>status</th>
              </tr>`;
      events.forEach(item => {
        html += `
              <tr>
                <td>${item.id}</td>
                <td>${item.user_id}</td>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.start_time}</td>
                <td>${item.end_time}</td>
                <td>${item.status}</td>
          </tr>`;
          });
      html += `</table>
          </body>
        </html>
      `;
  
      res.send(html); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  }).catch(err => console.log(err));

