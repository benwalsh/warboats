(function() {
  'use strict';

  $.fn.random = function() {
    return this.eq(Math.floor(Math.random() * this.length));
  };

  var $Boards = {}
    , Boats = { player: [], cpu: [] }
    , CurrentBoat
    , CpuBoardId
    , PlayerBoardId
    , SIZE;

  var AjaxFireSettings = function($el) {
    return {   url: '/boards/' + CpuBoardId + '/fire'
             , dataType: 'JSON'
             , data: { x: $el.data('x'), y: $el.data('y') } };
  };

  var AjaxValidatePositionSettings = function(data) {
    return {  url: '/boards/' + PlayerBoardId + '/validate'
            , dataType: 'JSON'
            , data: $.extend({ model: CurrentBoat.model }, data) }
  };

  var Boat = Class.extend({
    init: function(model, size, owner) {
      this.model = model;
      this.size = size;
      this.saved = false;
      this.hits = 0;
      this.owner = owner;
    }

    , isSunk: function() {
      return this.hits === this.size;
    }

    , possibleEndCoords: function() {
      if (typeof this.x === 'undefined' || typeof this.y === 'undefined') {
        return [];
      }
      var offset = this.size - 1;
      return [[this.x, this.y + offset], [this.x, this.y - offset], [this.x + offset, this.y], [this.x - offset, this. y]];
    }
  });

  var CpuFire = function() {
    $Boards['cpu'].addClass('inactive').find('td').off('click');
    var $target = FindTarget();
    $target.addClass('fired');
    if ($target.hasClass('occupied')) {
      var boat = GetBoat('player', $target.data('boat'));
      boat.hits++;
      $target.addClass('hit');
      ShowHitText(boat);
    } else {
      $target.addClass('miss');
      ShowText('I missed! Your turn.');
    }
    GameOver() || PlayerFire();
  };

  var CreateBoats = function() {
    var boats = $('main').data('boats');
    for (var key in boats) {
      if (boats.hasOwnProperty(key)) {
        Boats['player'].push(new Boat(key, boats[key], 'player'));
        Boats['cpu'].push(new Boat(key, boats[key], 'owner'));
      }
    }
  };

  var FindTarget = function() {
    return $Boards['player'].find('td:not(.fired)').random();
    // TODO - change difficulty by removing a proportion of $('td:not(.occupied)') from the collection before Randomizing.
  };

  var GameOver = function() {
    var winner = false
      , sunkPlayerBoats = 0
      , sunkCpuBoats = 0;
    for (var i = 0; i < Boats['player'].length; i++) {
      if (Boats['player'][i].isSunk()) {
        sunkPlayerBoats++;
      }
    }
    for (var i = 0; i < Boats['cpu'].length; i++) {
      if (Boats['cpu'][i].isSunk()) {
        sunkCpuBoats++;
      }
    }
    if (sunkPlayerBoats === Boats['player'].length) {
      winner = 'cpu';
    } else if (sunkCpuBoats === Boats['cpu'].length) {
      winner = 'player';
    }
    if (winner) {
      $Boards['player'].addClass('inactive gameover');
      $Boards['cpu'].addClass('inactive gameover');
      $('td').off('click');
      ShowText('Game over! ' + (winner === 'player' ? 'You' : 'I') + ' win! Reload to play again');
    }
    return winner;
  };

  var GetFirstUnsavedPlayerBoat = function() {
    for (var i = 0; i < Boats['player'].length; i++) {
      var boat = Boats['player'][i];
      if (!boat.saved) {
        return boat;
      }
    }
    return false;
  }

  var GetBoat = function(name, model) {

    for (var i = 0; i < Boats[name].length; i++) {
      if (Boats[name][i].model === model) {
        return Boats[name][i];
      }
    }
    return false;
  };

  var $GetCells = function(coordinates) {
    return $('td[data-x="' + coordinates[0] + '"][data-y="' + coordinates[1] + '"]');
  };

  var PlaceBoatEnd = function($el) {
    $.ajax(AjaxValidatePositionSettings({
        position: 'save'
      , start_x: CurrentBoat.x
      , start_y: CurrentBoat.y
      , end_x: $el.data('x')
      , end_y: $el.data('y')
    })).done(function(response) {
      if (response.success) {
        $('td').removeClass('possible');
        $.each(response.coordinates, function(_i, coordinates) {
          $GetCells(coordinates).addClass('occupied').attr('data-boat', CurrentBoat.model);
        });
        CurrentBoat.saved = true;
        Prompt();
      } else {
        alert('Invalid position');
      }
    });
  };

  var PlaceBoatStart = function($el) {
    $.ajax(AjaxValidatePositionSettings({
        position: 'start'
      , x: $el.data('x')
      , y: $el.data('y')
    })).done(function(response) {
      if (response.success) {
        $('td').off('click');
        $el.addClass('occupied').attr('data-boat', CurrentBoat.model);
        CurrentBoat.x = $el.data('x');
        CurrentBoat.y = $el.data('y');
        $.each(CurrentBoat.possibleEndCoords(), function(_i, coordinates) {
          $GetCells(coordinates).filter(':not(.occupied)').addClass('possible');
          // TODO: filter these to not mark invalid cells (with boats in between) as possible
        });
        $('td.possible').on('click', function() {
          PlaceBoatEnd($(this));
        });
      } else {
        alert('Invalid position');
      }
    });
  };

  var PlayerFire = function() {
    $Boards['cpu'].removeClass('inactive');
    $Boards['cpu'].find('td:not(.fired)').on('click', function() {
      var $el = $(this);
      $el.addClass('fired');
      $.ajax(AjaxFireSettings($el)).done(function(response) {
        if (response.success) {
          var boat = GetBoat('cpu', response.boat.model);
          boat.hits ++;
          $el.addClass('hit').attr('data-boat', response.boat.model);
          ShowHitText(boat);
        } else {
          $el.addClass('miss');
          ShowText('You missed! My turn.');
        }
        setTimeout(function() {
          GameOver() || CpuFire();
        }, 500);
      });
    });
  };

  var Prompt = function(boat) {
    CurrentBoat = boat ? boat : GetFirstUnsavedPlayerBoat();
    $('td').off('click');
    if (CurrentBoat) {
      ShowText('Place your ' + CurrentBoat.model + ' (' + CurrentBoat.size + ' squares)');
      $('td:not(.occupied)').on('click', function() {
        PlaceBoatStart($(this));
      });
    } else {
      ShowText('Let\s play! Your turn.');
      $Boards['player'].addClass('inactive');
      ShowBoard('cpu');
      $('td').off('click');
      PlayerFire();
    }
  };

  var ShowBoard = function(name) {
    var $table = $('<table>', { class: 'board', 'data-name': name });
    for (var i = 0; i < SIZE; i++) {
      var $row = $('<tr>');
      for (var j = 0; j < SIZE; j++) {
        $row.append($('<td>', { 'data-x': j, 'data-y': i }));
      }
      $table.append($row);
    }
    $('main').append($table);
    $Boards[name] = $table;
  }

  var ShowHitText = function(boat) {
    var text = '';
    text += (boat.owner === 'player') ? 'I' : 'You';
    text += boat.isSunk() ? ' sank' : ' hit';
    text += (boat.owner === 'player') ? ' your ' : ' my ';
    text += boat.model;
    text += '!';
    ShowText(text);
  };

  var ShowText = function(text) {
    $('.text').text(text);
  };

  $(function() {
    SIZE = $('main').data('board-size');
    PlayerBoardId = $('main').data('player-board-id');
    CpuBoardId = $('main').data('cpu-board-id');
    ShowBoard('player');
    CreateBoats();
    Prompt();
  });
})();
