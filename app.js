//making sure all html syntax is loaded befotr js
document.addEventListener("DOMContentLoaded", () => {
  const userGrid = document.querySelector(".grid-user");
  const computerGrid = document.querySelector(".grid-computer");
  const displayGrid = document.querySelector(".grid-display");
  const ships = [...document.querySelectorAll('.ship')];
  const destroyer = document.querySelector(".destroyer-container");
  const submarine = document.querySelector(".submarine-container");
  const cruiser = document.querySelector(".cruiser-container");
  const batleship = document.querySelector(".battleship-container");
  const carrier = document.querySelector(".carrier-container");
  const startButton = document.querySelector("#start");
  const rotateButton = document.querySelector("#rotate");
  const turnDisplay = document.querySelector("#whose-go");
  const infoDisplay = document.querySelector("#info");

  let isGameOver = false;
  let currentPlayer = "user";



  const userSquares = [];
  const computerSquares = [];
  let isHorizontal = true;
  const width = 10;
  //create board
  function createBoard(grid, squares, width) {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.dataset.id = i;
      grid.appendChild(square);
      squares.push(square);
    }
  }

  createBoard(userGrid, userSquares, width);
  createBoard(computerGrid, computerSquares, width);

  //random generating ships

  const shipArray = [
    {
      name: "destroyer",
      directions: [
        [0, 1],
        [0, width],
      ],
    },
    {
      name: "submarine",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: "cruiser",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
    },
    {
      name: "battleship",
      directions: [
        [0, 1, 2, 3],
        [0, width, width * 2, width * 3],
      ],
    },
    {
      name: "carrier",
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width * 2, width * 3, width * 4],
      ],
    },
  ];

  //drawing ships in random loactions
  function generateShip(ship) {
    //selecting random direction
    let randomDirection = Math.floor(Math.random() * ship.directions.length);
    let current = ship.directions[randomDirection];
    if (randomDirection === 0) direction = 1;
    if (randomDirection === 1) direction = 10;
    //selecting start block and making sure it give sufficient space
    let randomStart = Math.abs(
      Math.floor(
        Math.random() * computerSquares.length -
        ship.directions[0].length * direction
      )
    );
    //Making sure non of the block is taken
    const isTaken = current.some((index) =>
      computerSquares[randomStart + index].classList.contains("taken")
    );
    //Making sure non of the ship's block is at right edge
    const isAtRightEdge = current.some(
      (index) => (randomStart + index) % width === width - 1
    );
    //Same for left edge
    const isAtLeftEdge = current.some(
      (index) => (randomStart + index) % width === 0
    );

    if (!isTaken && !isAtLeftEdge && !isAtRightEdge) {
      current.forEach((index) =>
        computerSquares[randomStart + index].classList.add("taken", ship.name)
      );
    } else {
      generateShip(ship);
    }
  }

  generateShip(shipArray[0]);
  generateShip(shipArray[1]);
  generateShip(shipArray[2]);
  generateShip(shipArray[3]);
  generateShip(shipArray[4]);

  //Rotate ships
  function rotate() {
    if (isHorizontal) {
      destroyer.classList.toggle("destroyer-container-vertical");
      batleship.classList.toggle("batleship-container-vertical");
      cruiser.classList.toggle("cruiser-container-vertical");
      submarine.classList.toggle("submarine-container-vertical");
      carrier.classList.toggle("carrier-container-vertical");
      isHorizontal = false;
      return
    }
    if (!isHorizontal) {
      destroyer.classList.toggle("destroyer-container-vertical");
      batleship.classList.toggle("batleship-container-vertical");
      cruiser.classList.toggle("cruiser-container-vertical");
      submarine.classList.toggle("submarine-container-vertical");
      carrier.classList.toggle("carrier-container-vertical");
      isHorizontal = true;
      return
    }
  }
  rotateButton.addEventListener("click", rotate);






  //drag and drop
  Array.from(ships).forEach(function (ship) {
    ship.addEventListener("dragstart", dragStart)
  });
  userSquares.forEach((square) =>
    square.addEventListener("dragstart", dragStart)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragover", dragOver)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragenter", dragEnter)
  );
  userSquares.forEach((square) =>
    square.addEventListener("dragleave", dragLeave)
  );
  userSquares.forEach((square) => square.addEventListener("drop", dragDrop));
  userSquares.forEach((square) => square.addEventListener("dragend", dragEnd));

  let selectedShipNameWithIndexs;
  let draggedShip;
  let draggedShipLength;

  Array.from(ships).forEach(function (ship) {
    ship.addEventListener("mousedown", (e) => {
      selectedShipNameWithIndexs = e.target.id
      console.log(selectedShipNameWithIndexs)
    })
  });

  function dragStart() {
    draggedShip = this;
    //no of child block in ship
    draggedShipLength = this.childNodes.length
  }
  function dragOver(e) {
    e.preventDefault();
  }
  function dragEnter(e) {
    e.preventDefault();
  }
  function dragLeave() { }
  function dragDrop() {
    //ships name with last id
    let shipNameWithLastId = draggedShip.lastChild.id;
    console.log(shipNameWithLastId)
    //ships name
    let shipClass = shipNameWithLastId.slice(0, -2);
    console.log(shipClass)
    //last block in ship
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
    console.log(lastShipIndex);
    //where will the ship be on the grid, this is the user-grid block
    //it has the block where the ship's selected block is dropped
    let shipLastId = lastShipIndex + parseInt(this.dataset.id)
    console.log(this)
    console.log(shipLastId);
    const notAllowedHorizontal = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 12, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93]
    let newnotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)

    const notAllowedVertical = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60]
    let newnotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)
    //which block of ship is selected
    selectedShipIndex = parseInt(selectedShipNameWithIndexs.substr(-1))
    console.log(selectedShipIndex)
    // grid's block's id where last block of ship is landing 
    shipLastId = shipLastId - selectedShipIndex
    console.log(shipLastId)

    if (isHorizontal && !newnotAllowedHorizontal.includes(shipLastId)) {
      for (let i = 0; i < draggedShipLength; i++) {
        //add shipclass to the user grid where its placed
        userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass);
      }
    }
    else if (!isHorizontal && !newnotAllowedVertical.includes(shipLastId)) {
      console.log("here")
      for (let i = 0; i < draggedShipLength; i++) {
        console.log(parseInt(this.dataset.id) - selectedShipIndex + width * i)
        userSquares[parseInt(this.dataset.id) - selectedShipIndex + width * i].classList.add('taken', shipClass);

      }
    }
    else return
    displayGrid.removeChild(draggedShip)

  }
  function dragEnd() {
    console.log('drageEnd')
  }


  console.log(typeof computerSquares)
  //Game Logic
  function playGame() {
    if (isGameOver) return
    if (currentPlayer === "user") {
      turnDisplay.innerHTML = 'Your Go';
      Array.from(computerSquares).forEach(function (square) {
        square.addEventListener('click', function (e) {
          revealSquare(square);
        })
      });

    }
    if (currentPlayer === "computer") {
      turnDisplay.innerHTML = "Computer's Go"
      //function computer turn
      setTimeout(computerGo, 1000);
    }
  }
  startButton.addEventListener('click', playGame);

  let destroyerCounter = 0;
  let submarineCounter = 0;
  let cruiserCounter = 0;
  let battleshipCounter = 0;
  let carrierCounter = 0;



  function revealSquare(square) {
    if (!square.classList.contains('boom')) {
      if (square.classList.contains('destroyer')) destroyerCounter++;
      if (square.classList.contains('submarine')) submarineCounter++;
      if (square.classList.contains('cruiser')) cruiserCounter++;
      if (square.classList.contains('battleship')) battleshipCounter++;
      if (square.classList.contains('carrier')) carrierCounter++;
    }
    console.log(destroyerCounter);

    if (square.classList.contains('taken')) {
      square.classList.add('boom');
    }
    else {
      square.classList.add('miss')
    }
    checkForWins()
    currentPlayer = 'computer';
    playGame()
  }

  let cdestroyerCounter = 0;
  let csubmarineCounter = 0;
  let ccruiserCounter = 0;
  let cbattleshipCounter = 0;
  let ccarrierCounter = 0;

  function computerGo() {
    let random = Math.floor(Math.random() * userSquares.length);

    if (!userSquares[random].classList.contains('boom')) {
      userSquares[random].classList.add('boom')
      if (userSquares[random].classList.contains('destroyer')) cdestroyerCounter++;
      if (userSquares[random].classList.contains('submariner')) csubmarineCounter++;
      if (userSquares[random].classList.contains('cruiser')) ccruiserCounter++;
      if (userSquares[random].classList.contains('battleship')) cbattleshipCounter++;
      if (userSquares[random].classList.contains('carrier')) ccarrierCounter++;
      checkForWins()
    } else computerGo()
    currentPlayer = "user";
    turnDisplay.innerHTML = 'Your Go'
  }

  function checkForWins() {
    if (destroyerCounter === 2) {
      infoDisplay.innerHTML = 'You sunk the computers destroyer';
      destroyerCounter = 10
    }

    if (submarineCounter === 3) {
      infoDisplay.innerHTML = 'You sunk the computers Submaine';
      submarineCounter = 10
    }
    if (cruiserCounter === 3) {
      infoDisplay.innerHTML = 'You sunk the computers Cruiser';
      cruiserCounter = 10
    }
    if (battleshipCounter === 4) {
      infoDisplay.innerHTML = 'You sunk the computers Battleship';
      battleshipCounter = 10
    }
    if (carrierCounter === 5) {
      infoDisplay.innerHTML = 'You sunk the computers Carrier';
      carrierCounter = 10
    }


    //computers score
    if (cdestroyerCounter === 2) {
      infoDisplay.innerHTML = 'Computer sunk your destroyer';
      cdestroyerCounter = 10
    }
    if (csubmarineCounter === 3) {
      infoDisplay.innerHTML = 'Computer sunk your submarine';
      csubmarineCounter = 10
    }
    if (ccruiserCounter === 3) {
      infoDisplay.innerHTML = 'Computer sumk your Cruiser';
      ccruiserCounter = 10
    }
    if (cbattleshipCounter === 4) {
      infoDisplay.innerHTML = 'Computer Sunk your Battleship';
      cbattleshipCounter = 10
    }
    if (ccarrierCounter === 5) {
      infoDisplay.innerHTML = 'Computer sunk yur Carrier';
      ccarrierCounter = 10
    }
    console.log('total')
    console.log(destroyerCounter + submarineCounter + cruiserCounter + battleshipCounter + carrierCounter)
    if (destroyerCounter + submarineCounter + cruiserCounter + battleshipCounter + carrierCounter === 50) {
      infoDisplay.innerHTML = "YOU WIN"
      gameOver()
    }
    if (cdestroyerCounter + csubmarineCounter + ccruiserCounter + cbattleshipCounter + ccarrierCounter === 50) {
      infoDisplay.innerHTML = "COMPUTER WIN"
      gameOver()
    }
  }

  function gameOver() {
    isGameOver = true;
    startButton.removeEventListener('click', playGame)
  }



});
