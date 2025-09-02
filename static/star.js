for (let i = 0; i < 70; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.top = Math.random() * 100 + 'vh';
  star.style.left = Math.random() * 100 + 'vw';
  star.style.animationDuration = (Math.random() * 2 + 1) + 's';
  document.body.appendChild(star);
}
