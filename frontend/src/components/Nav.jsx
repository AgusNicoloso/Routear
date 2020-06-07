import React from 'react';
import { MapPin } from 'react-feather'

class Nav extends React.Component {
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
                                    <li class="active"><a href="index.html">Home</a></li>
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

export default Nav;