(function () {
  var gameInit = false;

  function Character(name, played, player, healthPoints, attackPoints, counterAttack, defeated) {
    this.name = name;
    this.played = played;
    this.player = player;
    this.healthPoints = healthPoints;
    this.attackPoints = attackPoints
    this.counterAttack = counterAttack;
    this.defeated = defeated;

    this.attackPower = function () {
      this.attackPoints += 6;
    }

    this.attack = function (opponent) {
      this.healthPoints -= opponent.counterAttack;
      opponent.healthPoints -= this.attackPoints;
    }

    this.check = function () {
      if (this.healthPoints <= 0) {
        this.defeated = true;
        $("#opponent").empty();
        fightArray.pop();
      }
      if (this.player && this.defeated) {
        console.log(fightArray)
        endGame();
      };
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

  var fightArray = [];
  var charArray = [ryu, blanka, guile, ken, mBison, chunLi, zangief, balrog, sagat];

  function createCharacterList() {
    for (var i = 0; i < charArray.length; i++) {
      var char = $("<img>")
      char.addClass("character").attr("data-char-index", i);
      char.attr("src", `assets/images/${charArray[i].name}.jpg`);
      $("#character-list").append(char);
    }
  };

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

  function chooseCharacter() {
    $(".character").click(function () {

      var index = $(this).attr("data-char-index");
      index = parseInt(index);
      var character = charArray[index];

      if (!character.played && fightArray.length !== 2) {
        character.played = true;
        fight(character);

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
        console.log(fightArray);
      }

    });
  };

  $("#attack").on("click", function () {
    var player = fightArray[0];
    var opponent = fightArray[1];

    player.attack(opponent);
    player.check();
    updateHealth(player, "#hp-0");
    opponent.check();
    updateHealth(opponent, "#hp-1");
    player.attackPower();
  });

  function showCharacter(char, el) {
    $(el).empty();
    $(char).clone().animate({ height: "130px", width: "130px" }).appendTo(el);
  };

  function updateHealth(char, el) {
    var healthBar = $(el).attr("style", "width:" + char.healthPoints + "%");
    if (char.healthPoints === undefined) {
      $(el).attr("style", "width: 100%");
    } else {
      return healthBar;
    }
  };

  function fight(char) {
    if (!gameInit) {
      fightArray[0] = char;
    } else {
      fightArray[1] = char;
    }
  };

  function printStats(char, el) {
    $(el).html(`<p>${char.name} <br> HP:${char.healthPoints} <br>Attack: ${char.attackPoints} <br>Counter Attack: ${char.counterAttack}</p>`)
  };

  function endGame() {
    $("#player").fadeOut();
    $("#end").text("Game Over");
  };
  createCharacterList();
  showStats();
  chooseCharacter();

})();
