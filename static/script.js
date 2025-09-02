function startApp() {
  document.getElementById("welcomeModal").style.display = "none";
  document.getElementById("mainContainer").style.display = "flex";
  document.getElementById("inputBar").style.display = "flex";
  document.getElementById("codeInput").focus();
}

document.getElementById("codeInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendToAI();
  }
});

function appendMessage(text, type) {
  const container = document.getElementById("mainContainer");
  const msg = document.createElement("div");
  msg.className = "message " + type;

  let profile = type === 'user' ? '👤' : '🤖';
  msg.innerHTML = `<span class='profile-icon'>${profile}</span>`;

  if (text.includes("```")) {
    const codeContent = text.replace(/```[\w]*\n([\s\S]*?)```/, (match, p1) => {
      const safe = p1.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre>${safe}</pre><button class='copy-btn' onclick='copyText("${safe}", this)'>Copy</button>`;
    });
    msg.innerHTML += `<div>${codeContent}</div>`;
  } else {
    msg.innerHTML += `<span>${text}</span>`;
  }

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function copyText(txt, btn) {
  navigator.clipboard.writeText(txt);
  btn.innerText = 'Copied!';
  setTimeout(() => btn.innerText = 'Copy', 1500);
}

function sendToAI() {
  const input = document.getElementById("codeInput");
  const code = input.value.trim();
  if (!code) return;

  appendMessage(code, "user");
  appendMessage("<i>Typing...</i>", "ai");

  fetch("http://127.0.0.1:5000/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: code })  // ✅ Changed from `code` to `prompt`
  })
  .then(res => res.json())
  .then(data => {
    const aiMessages = document.querySelectorAll(".message.ai");
    if (aiMessages.length) aiMessages[aiMessages.length - 1].remove();

    if (data.response) {
      appendMessage("```js\n" + data.response + "\n```", "ai");
    } else {
      appendMessage("Error: " + (data.error || "Unknown response"), "ai");
    }
  })
  .catch(err => {
    const aiMessages = document.querySelectorAll(".message.ai");
    if (aiMessages.length) aiMessages[aiMessages.length - 1].remove();

    appendMessage("Error: " + err.message, "ai");
  });

  input.value = "";
}
