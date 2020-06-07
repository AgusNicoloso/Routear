import React, { Component, Fragment } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

class Home extends Component {
    
    render () {
        return (
            <Fragment>
               <Nav/>

               <Footer/>
            </Fragment>
        );
    }
}

export default Home;

