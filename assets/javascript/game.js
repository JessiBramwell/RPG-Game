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
    // Attack power increases by six each attack
    this.attackPower = function () {
      this.attackPoints += 6;
    }
    // Subtract attack points from health
    this.attack = function (opponent) {
      this.healthPoints -= opponent.counterAttack;
      opponent.healthPoints -= this.attackPoints;
    }
    /* Determine defeat 
    *   If the character is the opponent they are removed from the fightArray and the image is removed from the defender area of the DOM 
    *   If the player is defeated the endGame function is called
    */
    this.check = function () {
      if (this.healthPoints <= 0) {
        this.defeated = true;
        wins++;
        $("#opponent").empty();
        fightArray.pop();
      }
      if (this.player && this.defeated) {
        endGame("lost");
      }
      if (this.player && wins <= 8) {
        endGame("win!");
      }

    }

  }

  var ryu = new Character("Ryu", false, false, 130, 6, 6, false);
  var blanka = new Character("Blanka", false, false, 200, 10, 10, false);
  var guile = new Character("Guile", false, false, 100, 6, 4, false);
  var ken = new Character("Ken", false, false, 130, 6, 6, false);
  var mBison = new Character("M. Bison", false, false, 100, 6, 6, false);
  var chunLi = new Character("Chun-Li", false, false, 100, 6, 2, false);
  var zangief = new Character("Zangief", false, false, 80, 8, 10, false);
  var balrog = new Character("Balrog", false, false, 80, 6, 3, false);
  var sagat = new Character("Sagat", false, false, 80, 6, 4, false);

  var charArray = [ryu, blanka, guile, ken, mBison, chunLi, zangief, balrog, sagat];
  var fightArray = [];

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
          showCharacter(this, "#player");
          $("#player-name").text(character.name);
          character.player = true;
          gameInit = true;
        } else {
          updateHealth(character, "#hp-1");
          showCharacter(this, "#opponent");
          $("#opponent-name").text(character.name);
        }
        $(this).addClass("disabled")
      }

    });
  };

  // Attack on click
  $("#attack").on("click", function () {
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
  function showCharacter(char, el) {
    $(el).empty();
    $(char).clone().animate({ height: "130px", width: "130px" }).appendTo(el);
  };

  // Update health bar
  function updateHealth(char, el) {
    var healthBar = $(el).attr("style", "width:" + char.healthPoints + "%");
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

  // Pring player stats to the DOM
  function printStats(char, el) {
    $(el).html(`<p>${char.name} <br> HP:${char.healthPoints} <br>Attack: ${char.attackPoints} <br>Counter Attack: ${char.counterAttack}</p>`)
  };

  // Called if all opponents are defeated or if player is defeated
  function endGame(status) {
    $("#player #opponent").fadeOut();
    $("#end").html(`Game Over<br>You ${status}`);
  };


  createCharacterList();
  showStats();
  chooseCharacter();



})();
