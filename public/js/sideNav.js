
    /* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  if(!sessionStorage.getItem('hospitalTab')){
    sessionStorage.hospitalTab = '0';
  }
  document.getElementById("mySidenavTab").style.width = sessionStorage.hospitalTab;
  function openNavtab() {
    document.getElementById("mySidenavTab").style.width = "250px";
    sessionStorage.hospitalTab = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
  function closeNavtab() {
    document.getElementById("mySidenavTab").style.width = "0";
    sessionStorage.hospitalTab = "0";
  }