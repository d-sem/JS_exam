window.addEventListener('load', (function () {
  var start = new Date();
  var cur = " руб.";

  globalStat();
  periodStat();
  mostExpensiveOrders();
  clientele();
  
  // Основные функции
  
  // Таблица 1
  
  function globalStat() {
    var totalSum           = 0;
    var totalRecommended   = 0;
    var totalTypical       = 0;
    var withoutRecommended = 0;
    var withoutTypical     = 0;
    var customers          = 0;
  
    ordersList.sort(function (a, b) {
      return a.user_id - b.user_id;
    })
  
    for (var i = 0, count = ordersList.length; i < count; ++i) {
      totalSum         += ordersList[i].total;
      totalRecommended += ordersList[i].recommended;
      totalTypical     += ordersList[i].typical;
      
      if (ordersList[i].recommended == 0) {
        withoutRecommended++;
      }
      if (ordersList[i].typical == 0) {
        withoutTypical++;
      } 
    
      if (i > 0 && ordersList[i].user_id != ordersList[i - 1].user_id) {
        customers++;
      } 
    }
  
    if (ordersList[0]) {
      customers++;
    }
  
    output("#total-sum",                 formatNumber(totalSum)           + cur);
    output("#total-orders",              formatNumber(ordersList.length)       );
    output("#total-recommended",         formatNumber(totalRecommended)   + cur);
    output("#total-typical",             formatNumber(totalTypical)       + cur);
    output("#total-customers",           formatNumber(customers)               );
    output("#total-without-recommended", formatNumber(withoutRecommended)      );
    output("#total-without-typical",     formatNumber(withoutTypical)          );
  };
  
  // Таблица 2
  
  function periodStat(dayStart, monthStart, yearStart, dayEnd, monthEnd, yearEnd) {
    if (!dayStart)   { var dayStart   = 26 }
    if (!monthStart) { var monthStart = 5}
    if (!yearStart)  { var yearStart  = 2015}
    
    if (!dayEnd)     { var dayEnd     = 28}
    if (!monthEnd)   { var monthEnd   = 5}
    if (!yearEnd)    { var yearEnd    = 2015}
    
    var periodSum         = 0;
    var periodOrders      = 0;
    var periodCustomers   = 0;
    var periodRecommended = 0;
    var periodTypical     = 0;
    var periodArr         = [];
    var monthNames        = [" января", 
                             " февраля", 
                             " марта", 
                             " апреля", 
                             " мая", 
                             " июня", 
                             " июля", 
                             " августа", 
                             " сентября", 
                             " октября", 
                             " ноября", 
                             " декабря"];
    
    var dateStart = new Date(yearStart, monthStart, dayStart,  0,  0,  0,   0).valueOf() / 1000;
    var dateEnd   = new Date(yearEnd  , monthEnd,   dayEnd,   23, 59, 59, 999).valueOf() / 1000;
  
    ordersList.sort(function (a, b) {
      return a.user_id - b.user_id;
    })
  
    for (var i = 0, count = ordersList.length; i < count; ++i) {
      if (ordersList[i].timestamp >= dateStart && ordersList[i].timestamp <= dateEnd) {
        periodSum         += ordersList[i].total;
        periodRecommended += ordersList[i].recommended;
        periodTypical     += ordersList[i].typical;
        
        periodOrders++;
        periodArr.push(ordersList[i]);
      } 
    }
    
    for (var i = 0, count = periodArr.length; i < count; ++i) {
      if (i > 0 && periodArr[i].user_id != periodArr[i - 1].user_id) {
        periodCustomers++;
      } 
    }
  
    if (periodArr[0]) {
      periodCustomers++;
    }
  
    output("#period-sum",         formatNumber(periodSum)         + cur );
    output("#period-orders",      formatNumber(periodOrders)            );
    output("#period-customers",   formatNumber(periodCustomers)         );
    output("#period-recommended", formatNumber(periodRecommended) + cur );
    output("#period-typical",     formatNumber(periodTypical)     + cur );
    
    document.getElementById('stat-day-start').innerHTML     = dayStart;
    
    if ( monthEnd != monthStart) {
      document.getElementById('stat-month-start').innerHTML = monthNames[monthStart];
    } else {
      document.getElementById('stat-month-start').innerHTML = "";
    }
    
    if ( yearEnd != yearStart) {
      document.getElementById('stat-year-start').innerHTML  = " " + yearStart + " года";
    } else {
      document.getElementById('stat-year-start').innerHTML  = "";
    }
    
    document.getElementById('stat-day-end').innerHTML       = dayEnd;
    document.getElementById('stat-month-end').innerHTML     = monthNames[monthEnd];
    document.getElementById('stat-year-end').innerHTML      = yearEnd + " года";
  };
  
  // Таблица 3
  
  function mostExpensiveOrders(qOrders) {
    if (qOrders == undefined) { 
      var qOrders = 5;
    }
    
    var tbody    = document.querySelector ('#most-expensive tbody');
    var HTML     = '';
    var template = '<tr>\
                      <td>#date#</td>\
                      <td>#id#</td>\
                      <td>#user_id#</td>\
                      <td>#total#</td>\
                      <td>#typical#</td>\
                      <td>#recommended#</td>\
                    </tr>';
  
    ordersList.sort(function (a, b) {
      return b.total - a.total;
    })
  
    for(var i = 0; i < qOrders; i++) {
      var order = ordersList[i];
      var tHTML = template;
      
      tHTML = tHTML.replace('#date#',        formatDate( order.timestamp )               );
      tHTML = tHTML.replace('#id#',          order.id                                    );
      tHTML = tHTML.replace('#user_id#',     order.user_id                               );
      tHTML = tHTML.replace('#total#',       formatNumber(order.total)              + cur);
      tHTML = tHTML.replace('#typical#',     formatNumber(order.typical)            + cur);
      tHTML = tHTML.replace('#recommended#', formatNumber(order.recommended)        + cur);
  
      HTML += tHTML;
    }
    
    tbody.innerHTML = HTML;   
  };
  
  // Таблица 4
  
  function clientele(clienteleOrders) {
    if (clienteleOrders == undefined) {
      var clienteleOrders = 11;
    }
    
    var clienteleArr = [];
    var q            = 1;
    var total        = 0;
    var typical      = 0;
    var recommended  = 0;

    ordersList.sort(function (a, b) {
      return a.user_id - b.user_id
    })
  
    for (var i = 0, count = ordersList.length; i < count; ++i) {
      if (i > 0 && ordersList[i].user_id == ordersList[i - 1].user_id) {
        q++;
        
        total        = total + ordersList[i].total;
        typical     += ordersList[i].typical;
        recommended += ordersList[i].recommended;
      
      } else if(i > 0) {
        if ( q >= clienteleOrders) {
          var clienteleID = ordersList[i-1].user_id;
          var clienteleQ  = q;
          var clienteleTotal = total;
          var clienteleTypical = typical;
          var clienteleRecommended = recommended;
          var obj = {user_id:     clienteleID, 
                     orders:      clienteleQ,
                     total:       clienteleTotal,
                     typical:     clienteleTypical,
                     recommended: clienteleRecommended};

          clienteleArr.push(obj);
        }
        
        q = 1;
        total = 0;
        typical = 0;
        recommended  = 0;
      } 
    }
  
    var tbody = document.querySelector ('#clientele tbody');
    var HTML = '';
    var template = '<tr>\
                      <td>#user_id#</td>\
                      <td>#orders#</td>\
                      <td>#total#</td>\
                      <td>#typical#</td>\
                      <td>#recommended#</td>\
                    </tr>';
  
    for(var i = 0; i < clienteleArr.length; i++) {
      var client = clienteleArr[i];
      var tHTML  = template;
    
      tHTML = tHTML.replace('#user_id#', client.user_id);
      tHTML = tHTML.replace('#orders#', client.orders);
      tHTML = tHTML.replace('#total#', formatNumber(client.total) + cur);
      tHTML = tHTML.replace('#typical#', formatNumber(client.typical) + cur);
      tHTML = tHTML.replace('#recommended#', formatNumber(client.recommended) + cur);
  
      HTML += tHTML;
    }
      
    tbody.innerHTML = HTML;
  };
  
  // Таблица 5
  
  document.getElementById('show-orders').addEventListener('click', searchCustomer, false);
  
  function searchCustomer() {
    var tbody = document.querySelector ('#search tbody');
    var HTML = '';
    var template = '<tr>\
                      <td>#date#</td>\
                      <td>#id#</td>\
                      <td>#total#</td>\
                      <td>#typical#</td>\
                      <td>#recommended#</td>\
                    </tr>';
  
    var userId = document.querySelector('#input-value').value

    if(isNaN(userId) && userId != "") {
      alert("Ошибка! Введите число!");
    }
  
    for(var i = 0, count = ordersList.length; i < count; i++) {
      if (ordersList[i].user_id == userId) {
        var order = ordersList[i];
        var tHTML = template;
        
        tHTML = tHTML.replace('#date#',        formatDate(order.timestamp)           );
        tHTML = tHTML.replace('#id#',          order.id                              );
        tHTML = tHTML.replace('#total#',       formatNumber(order.total)        + cur);
        tHTML = tHTML.replace('#typical#',     formatNumber(order.typical)      + cur);
        tHTML = tHTML.replace('#recommended#', formatNumber(order.recommended)  + cur);
  
        HTML += tHTML;
      }
    }
      
    tbody.innerHTML = HTML;
  };
  
  // Дополнительная функциональность таблиц
  
  // Вторая таблица
  
  (function () {
    document.getElementById('table-menu-2').addEventListener('click', modal2, false);
  
    function modal2() {
      document.getElementById('modal-menu-2').classList.toggle('visible');
      document.getElementById('modal-background').classList.toggle('visible'); 
    }
    
    document.querySelector('#modal-menu-2 button').addEventListener('click', changeDate, false);
  
    function changeDate() {
      console.log(document.querySelector('#date-start').value); // 
      console.log(document.querySelector('#date-end').value);   //
      
      var start = document.querySelector('#date-start').value.split('-');
      var end   = document.querySelector('#date-end').value.split('-');
      
      periodStat(start[2], ( Number( start[1] ) - 1 ), start[0], end[2], ( Number( end[1] ) - 1 ), end[0]);
      
      console.log(start, end); //
      
      document.getElementById('modal-menu-2').classList.toggle('visible');
      document.getElementById('modal-background').classList.toggle('visible');
    }
  
    // Третья таблица
  
    document.getElementById('table-menu-3').addEventListener('click', modal3, false);
  
    function modal3() {
      document.getElementById('modal-menu-3').classList.toggle('visible');
      document.getElementById('modal-background').classList.toggle('visible'); 
    }
    
    document.querySelector('#modal-menu-3 button').addEventListener('click', changeExpensive, false);
  
    function changeExpensive() {
      var quantity = document.querySelector('#modal-menu-3 input').value;
      
      mostExpensiveOrders(quantity);
      
      document.getElementById('modal-menu-3').classList.toggle('visible');
      document.getElementById('modal-background').classList.toggle('visible');
    }
  
    // Четвертая таблица
  
    document.getElementById('table-menu-4').addEventListener('click', modal4, false);
    document.querySelector('#modal-menu-4 button').addEventListener('click', changeClientele, false);
  
    function modal4() {
      document.getElementById('modal-menu-4').classList.toggle('visible');
      document.getElementById('modal-background').classList.toggle('visible');
    }
  
    function changeClientele() {
      var quantity = document.querySelector('#modal-menu-4 input').value;
      
      clientele(quantity);
      
      document.getElementById('modal-menu-4').classList.toggle('visible');
      document.getElementById('modal-background').classList.toggle('visible');
    }

    //закрываем окно при клике по подложке
  
     document.getElementById('modal-background').addEventListener('click', closeModal, false);
     
    function closeModal() {
      document.getElementById('modal-background').classList.toggle('visible');
      document.getElementById('modal-menu-2').classList.remove('visible');
      document.getElementById('modal-menu-3').classList.remove('visible');
      document.getElementById('modal-menu-4').classList.remove('visible');
     }
  })();
  
  // Сортировка
  
  // Третья таблица
  
  var sortQ3 = 1;
  
  document.getElementById('most-expensive').addEventListener ('click', (function (e) {
    var grid = document.getElementById('most-expensive');
    
    if (e.target.nodeName == 'TH') {
      var q = e.target.cellIndex;
      
      sort(q, sortQ3);
    }
  
    function sort(e){
      if (sortQ3 === 1) {
        for (var i = 1; i< (grid.rows.length); i++){
          for (var j = grid.rows.length - 1; j > i; j-- ){
            el1 = ((e == 3) || (e == 4) || (e == 5)) ? 
              toNumber(grid.rows[j-1].cells[e].innerHTML) : grid.rows[j-1].cells[e].innerHTML;
            el2 = ((e == 3) || (e == 4) || (e == 5)) ? 
              toNumber(grid.rows[j].cells[e].innerHTML)   : grid.rows[j].cells[e].innerHTML;
      
            if (el1 < el2) {
              var prev = grid.rows[j-1].innerHTML;
              
              grid.rows[j-1].innerHTML = grid.rows[j].innerHTML;
              grid.rows[j].innerHTML = prev;    
            }
          }
        }
          
        sortQ3 = 2;
        
      } else if (sortQ3 === 2) {
        for (var i = 1; i< (grid.rows.length); i++){
          for (var j = grid.rows.length - 1; j > i; j-- ){
            el1 = ((e == 3) || (e == 4) || (e == 5)) ? 
              toNumber(grid.rows[j-1].cells[e].innerHTML) : grid.rows[j-1].cells[e].innerHTML;
            el2 = ((e == 3) || (e == 4) || (e == 5)) ? 
              toNumber(grid.rows[j].cells[e].innerHTML)   : grid.rows[j].cells[e].innerHTML;
      
            if (el1 > el2) {
              var prev = grid.rows[j-1].innerHTML;
              
              grid.rows[j-1].innerHTML = grid.rows[j].innerHTML;
              grid.rows[j].innerHTML = prev;    
            }
          }
        }
        
        sortQ3 = 1;
      }
    } 
  }), false);
    
  // Четвертая таблица
      
  var sortQ4 = 1;
  
  document.getElementById('clientele').addEventListener ('click', (function (e) {
    var grid = document.getElementById('clientele');
  
    if (e.target.nodeName == 'TH') {
      var q = e.target.cellIndex;
      
      sort(q, sortQ4);
    }
  
    function sort(e){
      if (sortQ4 === 1) {
        for (var i = 1; i< (grid.rows.length); i++){
          for (var j = grid.rows.length - 1; j > i; j-- ){
            el1 = ((e == 1) || (e == 2) || (e == 3) || (e == 4)) ? 
              toNumber(grid.rows[j-1].cells[e].innerHTML) : grid.rows[j-1].cells[e].innerHTML;
            el2 = ((e == 1) || (e == 2) || (e == 3) || (e == 4)) ? 
              toNumber(grid.rows[j].cells[e].innerHTML)   : grid.rows[j].cells[e].innerHTML;
      
            if (el1 < el2) {
              var prev = grid.rows[j-1].innerHTML ;
        
              grid.rows[j-1].innerHTML = grid.rows[j].innerHTML;
              grid.rows[j].innerHTML = prev;    
            }
          }
        }
          
        sortQ4 = 2;
        
      } else if (sortQ4 === 2) {
        for (var i = 1; i< (grid.rows.length); i++){
          for (var j = grid.rows.length - 1; j > i; j-- ){
            el1 = ((e == 1) || (e == 2) || (e == 3) || (e == 4)) ? 
              toNumber(grid.rows[j-1].cells[e].innerHTML) : grid.rows[j-1].cells[e].innerHTML;
            el2 = ((e == 1) || (e == 2) || (e == 3) || (e == 4)) ? 
              toNumber(grid.rows[j].cells[e].innerHTML)   : grid.rows[j].cells[e].innerHTML;
        
            if (el1 > el2) {
              var prev = grid.rows[j-1].innerHTML;
          
              grid.rows[j-1].innerHTML = grid.rows[j].innerHTML;
              grid.rows[j].innerHTML = prev;    
            }
          }
        }
          
        sortQ4 = 1;
      }
    } 
  }), false);
  
  // Пятая таблица
  
  var sortQ5 = 1;
  
  document.getElementById('search').addEventListener ('click', (function (e) {
    var grid = document.getElementById('search');
  
    if (e.target.nodeName == 'TH') {
      var q = e.target.cellIndex;
    
      sort(q, sortQ3);
    }
  
    function sort(e){
      if (sortQ5 === 1) {
        for (var i = 1; i< (grid.rows.length); i++){
          for (var j = grid.rows.length - 1; j > i; j-- ){
            el1 = ((e == 3) || (e == 4) || (e == 5)) ? 
              toNumber(grid.rows[j-1].cells[e].innerHTML) : grid.rows[j-1].cells[e].innerHTML;
            el2 = ((e == 3) || (e == 4) || (e == 5)) ? 
              toNumber(grid.rows[j].cells[e].innerHTML)   : grid.rows[j].cells[e].innerHTML;
    
            if (el1 < el2) {
              var prev = grid.rows[j-1].innerHTML;
            
              grid.rows[j-1].innerHTML = grid.rows[j].innerHTML;
              grid.rows[j].innerHTML = prev;    
            }
          }
        }
          
        sortQ5 = 2;
        
      } else if (sortQ5 === 2) {
        for (var i = 1; i< (grid.rows.length); i++){
          for (var j = grid.rows.length - 1; j > i; j-- ){
            el1 = ((e == 3) || (e == 4) || (e == 5)) ? 
              toNumber(grid.rows[j-1].cells[e].innerHTML) : grid.rows[j-1].cells[e].innerHTML;
            el2 = ((e == 3) || (e == 4) || (e == 5)) ? 
              toNumber(grid.rows[j].cells[e].innerHTML)   : grid.rows[j].cells[e].innerHTML;
      
            if (el1 > el2) {
              var prev = grid.rows[j-1].innerHTML;
      
              grid.rows[j-1].innerHTML = grid.rows[j].innerHTML;
              grid.rows[j].innerHTML = prev;    
            }
          }
        }
          
        sortQ5 = 1;
      }
    } 
  }), false);
  
  // Вспомогательные функции

  function formatDate(timestamp) {
    var date = new Date(timestamp * 1000);
    var dd = date.getDate();
    
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth();
    
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();

    return dd + '.' + mm + '.' + yy;
  }

  function output(css, text) {
    return (document.querySelector(css).innerHTML = text);
  }

  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
  }
  
  function toNumber(thisString) {
    return Number(thisString.replace(/\s+/g, '').replace('руб.', ''));
  }
  
  var end = new Date();
  
  console.log('Скорость ' + (end.getTime() - start.getTime()) + ' мс');
}), false);