(function () {
  var wins = 0;
  var losses = 0;
  var gameInit = false;

  function Character(name, isPlayer, healthPoints, attackPoints, counterAttack, defeated) {
    this.name = name;
    this.isPlayer = isPlayer;
    this.healthPoints = healthPoints;
    this.attackPoints = attackPoints
    this.counterAttack = counterAttack;
    this.defeated = defeated;

    this.attackPower = function () {
      this.attackPoints += this.attackPoints
    }

    this.attack = function (opponent) {
      this.healthPoints = this.healthPoints - opponent.counterAttack;
      opponent.healthPoints = opponent.healthPoints - this.attackPoints;

      console.log(this.healthPoints)
      console.log(opponent.healthPoints)
    }

    this.check = function () {
      if (this.healthPoints <= 0) {
        this.defeated = true;
        alert("defeated")
      }
    }
  }

  var ryu = new Character("Ryu", false, 20, 6, 3, false);
  var ken = new Character("Ken", false, 20, 6, 4, false);
  var eHonda = new Character("E. Honda", false, 20, 6, 6, false);
  var guile = new Character("Guile", false, 20, 6, 6, false);
  var chunLi = new Character("Chun-Li", false, 20, 6, 6, false);
  var blanka = new Character("Blanka", false, 20, 6, 6, false);
  var zangief = new Character("Zangief", false, 20, 6, 6, false);
  var dhalsim = new Character("Dhalsim", false, 20, 6, 6, false);
  var balrog = new Character("Balrog", false, 20, 6, 6, false);
  var vega = new Character("Vega", false, 20, 6, 6, false);
  var sagat = new Character("Sagat", false, 20, 6, 6, false);
  var mBison = new Character("M. Bison", false, 20, 6, 6, false);

  var fightArray = [];
  var charArray = [ryu, ken, eHonda, guile, chunLi, blanka, zangief, dhalsim, balrog, vega, sagat, mBison];

  function createCharacterList() {
    for (var i = 0; i < charArray.length; i++) {
      var char = $("<img>")
      char.addClass("character").attr("data-char-index", i);
      char.text();
      char.attr("src", "assets/images/" + charArray[i].name + ".gif");
      $("#character-list").append(char);
    }
  };

  function chooseCharacter() {
    $(".character").on("click", function () {
      var char = $(this).attr("data-char-index");
      char = parseInt(char);

      if (!gameInit) {
        charArray[char].isPlayer = true;
        console.log(charArray[char]);
        fight(char);
        showCharacter(this, "#player");
        gameInit = true;
      } else {
        console.log(charArray[char]);
        fight(char);
        showCharacter(this, "#opponent");
      }
    });
  };

  $("#attack").on("click", function () {
    var player = fightArray[0];
    var opponent = fightArray[1];

    player.attack(opponent);
    player.check();
    opponent.check();
    player.attackPower();

    defeated();

    console.log("attack")
    console.log(fightArray)

  });

  function defeated() {
    if (opponent.defeated) {
      $("#opponent").fadeOut();
      fightArray.pop[1];
    } else if (player.defeated) {
      $("#player").fadeOut();
    }

  };

  function nextOpponent() {

  };

  function showCharacter(char, el) {
    $(el).append(char);
  };

  function fight(char) {
    if (!gameInit) {
      fightArray[0] = charArray[char];
    } else {
      fightArray[1] = charArray[char];
    }
  };

  function endGame() {
    alert("end")

  };
  createCharacterList();
  chooseCharacter();

})();
