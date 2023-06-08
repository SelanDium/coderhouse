import express from 'express';
import __dirname from './utils.js';
import productRouter from './routes/products.router.js';
import cartsRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js'
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import initializePassport from './config/passport.config.js';
import passport from 'passport';


const app = express();

try {
    await mongoose.connect('mongodb+srv://selan:tOGxrxC3Gl85X83f@cluster39760ap.0ixq44f.mongodb.net/probandoLogin?retryWrites=true&w=majority')
    console.log('conectado a mongoose');
} catch (error) {
    console.log(error);
}
app.use(session({
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 3600
    }),
    secret: 'Coder39760',
    resave: true,
    saveUninitialized: true
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));
app.engine('handlebars',handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');



app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);
app.use('/api/products',productRouter)
app.use('/api/carts', cartsRouter)



app.listen(8080, () => {console.log('Servidor escuchando en el puerto 8080')})
