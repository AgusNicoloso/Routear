import React from 'react';
import { MapPin } from 'react-feather'
import {withModals} from "../contexts/ModalsContext";

class Nav extends React.Component {

   openLoginModal = () => {
      this.props.openModal('login', {})
   }

    render() {
        return (
         <header class="header">
            <div class="container" style={{height:60}}>
               <div class="row">
                  <div class="col">
                        <div class="header_content d-flex flex-row align-items-center justify-content-start">
                           <div class="logo mt-n2">
                              <MapPin color="white" size={30}/>
                           </div>
                           <nav className="main_nav ml-auto mt-n2" >
                              <ul>
                                 <li className="active"><a href="">Home</a></li>
                                 <li className="active clickable" onClick={this.openLoginModal}>Login</li>
                              </ul>
                           </nav>
                           
                           {/* <div class="hamburger ml-auto"><i class="fa fa-bars" aria-hidden="true"></i></div> */}
                        </div>
                  </div>
               </div>
            </div>
         </header>
        )
    }
}

export default withModals(Nav);