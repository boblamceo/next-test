import { useEffect, useState, forwardRef } from 'react';
import './App.css';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import useSound from 'use-sound';
import ding from  './ding.mp3'
import lose from './lose.mp3'

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
function getCookie(cname) {
	let name = cname + '=';
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}
function App() {
	const [ grid, setGrid ] = useState([]);
	const [ num, setNum ] = useState(0);
	const [ initialised, setInit ] = useState(false);
	const [ lost, setLose ] = useState(false);
	const [ level, setLevel ] = useState(1);
	const [ powerup, setPowerup ] = useState(3);
	const [ currlength, setCurrLength ] = useState(1);
	const [dingsound] = useSound(ding, {
		interrupt: true
	})
	const [losesound] = useSound(lose)
	// document.cookie = "high=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
	const annex = (index) => {
		let arr = grid;
		arr[index].color = 'brown';
		setGrid([ ...arr ]);
	};
	const init = (curr) => {
		setGrid(curr);
		setTimeout(() => {
			setInit(true);
		}, 50);
	};
	const startup = (level) => {
		setInit(false);
		let curr = [];
		for (let i = 0; i <= 24; i++) {
			for (let j = 0; j <= 24; j++) {
				curr.push({ val: Math.floor(Math.random() * (level * 100 + 1)), color: '#bbdaa4' });
			}
		}
		init(curr);
	};
	useEffect(
		() => {
			startup(level);
		},
		[ level ]
	);
	useEffect(
		() => {
			if (initialised) {
				annex(0);
				setNum(num + grid[0].val);
			}
		},
		[ initialised ]
	);
	return (
		<div className="App">
			<header className="App-header">
				<div className="container">
					<div>
						{' '}
						<div>Current number: {num}</div> <div>Record: {getCookie('high') || 1}</div> <div>Current Score: {currlength}</div>
						<button
							onClick={() => {
								if (powerup > 0) {
									setNum(num * 2);
									setPowerup(powerup - 1);
								}
							}}
						>
							x2 ({powerup} more)
						</button>
					</div>
					<div className="grid">
						{grid.map((value, index) => {
							return (
								<div
									className={'indiv'}
									style={{ backgroundColor: value.color }}
									key={index}
									onClick={() => {
										if (index === 624) {
											alert('you win!');
										}
										if (value.color === '#bbdaa4') {
											const keep = new Set();
											const indexes = grid.map((_, index) => index);
											const current = indexes.filter((curr) => grid[curr].color === 'brown');
											const length = current.length + 1;
											setCurrLength(length);
											if (!getCookie('high') || parseInt(getCookie('high'), 10) <= length) {
												document.cookie = `high=${length}`;
											}
											current.forEach((index) => {
												keep.add(index - 1);
												keep.add(index + 1);
												keep.add(index - 25);
												keep.add(index + 25);
											});
											if (num > value.val && keep.has(index)) {
												annex(index);
												dingsound()
												setNum(value.val);
											} else if (keep.has(index)) {
												annex(index);
												setLose(true);
												losesound()
											}
										}
									}}
								>
									{/* {value.color === "brown" ? value.val : "‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎"} */}
									{value.val}
								</div>
							);
						})}
					</div>
				</div>
			</header>
			<Dialog
				onClose={() => {
					window.location.reload();
				}}
				open={lost}
				TransitionComponent={Transition}
			>
				<DialogTitle>You Lost! Press the gray area to play again!</DialogTitle>
			</Dialog>
		</div>
	);
}

export default App;
