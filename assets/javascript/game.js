(function () {
  var gameInit = false;
  var wins = 0;

  function Character(name, played, player, healthPoints, attackPoints, counterAttack, defeated) {
    this.name = name;
    this.played = played;
    this.player = player;
    this.healthPoints = healthPoints;
    this.attackPoints = attackPoints
    this.counterAttack = counterAttack;
    this.defeated = defeated;
    this.saveValues = function () {
      var originalValues = {}
      for (var prop in this) {
        if (this.hasOwnProperty(prop) && prop !== originalValues) {
          originalValues[prop] = this[prop];
        }
      }
      this.originalValues = originalValues;
    },
      this.reset = function () {
        for (var prop in this.originalValues) {
          this[prop] = this.originalValues[prop];
        }
      },

      // Attack power increases by six each attack
      this.attackPower = function () {
        this.attackPoints += 6;
      },
      // Subtract attack points from health
      this.attack = function (opponent) {
        // if (this.healthPoints !== 0 && opponent.healthPoints !== 0) {
        this.healthPoints -= opponent.counterAttack;
        opponent.healthPoints -= this.attackPoints;
        // }

      },
      /* Determine defeat 
      *   If the character is the opponent they are removed from the fightArray and the image is removed from the defender area of the DOM 
      *   If the player is defeated the endGame function is called
      */
      this.check = function () {
        if (this.healthPoints <= 0) {
          this.defeated = true;
          if (this.player) {
            endGame("lost");
          } else {
            wins++;
            $("#opponent").empty();
            fightArray.pop();
            determineWin();
          }
        }
      }
  }

  var ryu = new Character("Ryu", false, false, 130, 6, 8, false);
  var blanka = new Character("Blanka", false, false, 150, 10, 10, false);
  var guile = new Character("Guile", false, false, 130, 7, 5, false);
  var ken = new Character("Ken", false, false, 120, 7, 7, false);
  var mBison = new Character("M. Bison", false, false, 120, 6, 6, false);
  var chunLi = new Character("Chun-Li", false, false, 200, 4, 4, false);
  var zangief = new Character("Zangief", false, false, 80, 14, 14, false);
  var balrog = new Character("Balrog", false, false, 100, 9, 8, false);
  var sagat = new Character("Sagat", false, false, 100, 14, 8, false);

  var charArray = [ryu, blanka, guile, ken, mBison, chunLi, zangief, balrog, sagat];
  var fightArray = [];

  function init() {
    for (let i = 0; i < charArray.length; i++) {
      charArray[i].saveValues();
    }
  }

  // Create a grid of each characters images with a data attribute correlating to thier index in the charArary
  function createCharacterList() {
    for (var i = 0; i < charArray.length; i++) {
      var char = $("<img>")
      char.addClass("character").attr("data-char-index", i);
      char.attr("src", `assets/images/${charArray[i].name}.jpg`);
      $("#character-list").append(char);
    }
  };

  /* Show character stats on mouseenter
  *   Display stats one either the player 1 or player 2 position
  *   Empty div on mouseleave
  */
  function showStats() {
    $(".character").mouseenter(function () {
      var char = $(this).attr("data-char-index");
      char = charArray[parseInt(char)];

      if (!gameInit) {
        printStats(char, "#stats-0")
      } else {
        printStats(char, "#stats-1")
      }
    });

    $(".character").mouseleave(function () {
      $("#stats-0, #stats-1").empty();
    });
  };

  // Choose character on click
  function chooseCharacter() {
    $(".character").click(function () {

      // Create variable that targets relevant Character Object
      var index = $(this).attr("data-char-index");
      index = parseInt(index);
      var character = charArray[index];

      // Limit character choice to those that have not been played previously
      // Prevent user from choosing more than one opponent
      if (!character.played && fightArray.length !== 2) {
        character.played = true;
        // add Character Object to correct position in fightArray
        fight(character);

        // Use gameInit to place first character selection in player 1 position
        if (!gameInit) {
          showCharacter(this, "#player", character);
          character.player = true;
          gameInit = true;
        } else {
          updateHealth(character, "#hp-1");
          showCharacter(this, "#opponent", character);
        }
        $(this).addClass("disabled")
      }

    });
  };

  // Attack on click
  $(".attack").on("click", function () {
    // Create Human readable variables
    var player = fightArray[0];
    var opponent = fightArray[1];

    player.attack(opponent);
    player.check();
    updateHealth(player, "#hp-0");
    opponent.check();
    updateHealth(opponent, "#hp-1");
    player.attackPower(); // Increase attack points on each attack
  });

  //Remove previous image and add new character to defender area
  function showCharacter(img, el, char) {
    $(el).empty();
    $(img).clone().animate({ height: "130px", width: "130px" }).appendTo(el);
    var name = $(`<h3 class="name">${char.name}</h3>`);
    $(el).prepend(name);
  };

  // Update health bar based on percent of original health
  function updateHealth(char, el) {
    var healthPercent = (char.healthPoints / char.originalValues.healthPoints) * 100;
    var healthBar = $(el).attr("style", "width:" + healthPercent + "%");
    if (char.healthPoints === undefined) {
      $(el).attr("style", "width: 100%");
    } else {
      return healthBar;
    }
  };

  // Add characters to correct index of fightArray
  function fight(char) {
    if (!gameInit) {
      fightArray[0] = char;
    } else {
      fightArray[1] = char;
    }
  };

  // Print player stats to the DOM
  function printStats(char, el) {
    $(el).html(`<p>${char.name} <br> HP:${char.healthPoints} <br>Attack: ${char.attackPoints} <br>Counter Attack: ${char.counterAttack}</p>`)
  };

  function determineWin() {
    if (wins >= 8) {
      endGame("win!");
    }
  };

  // Called if all opponents are defeated or if player is defeated
  function endGame(status) {
    $("#end").html(`Game Over<br>You ${status}`);

    $("#play").show().on("click", function () {
      resetGame();
      $("#play").hide();
    });
  };

  function resetGame() {
    // *** how in the world do we reset object values
    for (let i = 0; i < charArray.length; i++) {
      charArray[i].reset();
    }
    gameInit = false;
    $("#character-list").children().removeClass("disabled");
    $("#end").html("Player Select");
    $("#hp-0, #hp-1").attr("style", "width: 100%");
    $("#player, #opponent").empty();
  }

  // *** dont forget to push your changes if this works
  // *** we still haven't figured out the health bar. I think the solution might be related to reseting object values
  init();
  createCharacterList();
  showStats();
  chooseCharacter();

})();
