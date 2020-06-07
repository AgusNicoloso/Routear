import React from 'react';

class Footer extends React.Component {
    render() {
        return (
         <footer class="footer" style={{backgroundColor:"blue"}}>
            <div class="footer_bar">
               <div className="container">
                  <div class="row">
                     <div class="col">
                        <div>
                           <div className="mt-2 mb-2 white" >
                              © {"2020 Routear"}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </footer>
        )
    }
}

export default Footer;