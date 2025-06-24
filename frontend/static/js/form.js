document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('nameForm');
    const input = document.getElementById('nameInput');
    const responseArea = document.getElementById('responseArea');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = input.value;

        const res = await fetch('http://localhost:5000/api/greet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        const data = await res.json();
        responseArea.textContent = data.message;
    });
});
