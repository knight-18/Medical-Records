
    /* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }



  if(!sessionStorage.getItem('sideNavBar')){
    sessionStorage.sideNavBar = '0';
  }
  document.getElementById("mySidenavTab").style.width = sessionStorage.sideNavBar;
  function openNavtab() {
    document.getElementById("mySidenavTab").style.width = "250px";
    sessionStorage.sideNavBar = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
  function closeNavtab() {
    document.getElementById("mySidenavTab").style.width = "0";
    sessionStorage.sideNavBar = "0";
  }