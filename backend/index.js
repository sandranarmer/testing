// declarative:
const { connect } = require('./connection');
const express = require('express');
const cookieParser = require('cookie-parser');

const { Init_User } = require('./components/user/user.controller');
const { Init_Order } = require('./components/order/order.controller');
const { Init_Feedback } = require('./components/feedback/feedback.controller');
const { Init_Menu } = require('./components/menu/menu.api');
const { Init_Reservation } = require('./components/reservation/reservation.api');

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 6000;
connect(app, PORT);
  
// initialize componenets:
Init_Order(app);
Init_Menu(app);
Init_Reservation(app);
Init_User(app);
Init_Feedback(app);