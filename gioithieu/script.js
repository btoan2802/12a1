let currentUser = null;

function login()
{
    const fullname = document.getElementById("loginName").value.trim();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    const errorBox = document.getElementById("loginError");

    errorBox.innerText = ""; // reset lỗi

    if(!fullname)
    {
        errorBox.innerText = "Vui lòng nhập họ tên";
        return;
    }

    if(user === "admin" && pass === "1")
    {
        currentUser = {
            name: fullname,
            avatar: "teacher/thanh.jpg"
        };

        document.getElementById("authArea").innerHTML = `
            <div class="d-flex align-items-center gap-2 text-white">
                <img src="${currentUser.avatar}" 
                     style="width:32px;height:32px;border-radius:50%">
                <strong>${currentUser.name}</strong>
            </div>
        `;

        bootstrap.Modal.getInstance(
            document.getElementById('loginModal')
        ).hide();
    }
    else
    {
        errorBox.innerText = "Sai tên đăng nhập hoặc mật khẩu";
    }
}
function fakeRegister()
{
    // hiện toast
    const toast = new bootstrap.Toast(
        document.getElementById("registerToast")
    );
    toast.show();

    // đóng modal
    const modal = bootstrap.Modal.getInstance(
        document.getElementById('registerModal')
    );
    modal.hide();
    
}


// ===== COMMENT GIẢ =====
const comments = [
{
    id: 1,
    name: "Cristiano Ronaldo",
    text: "Tuổi trẻ Việt Nam hãy luôn nỗ lực 💪, cố lên nha Hồng Ngọc, Bảo Toàn, Hoài Linh, Đăng Khoa, Kim Nhung, Yến Nhi",
    time: "26/03/2026 09:15",
    avatar: "https://cdn2.tuoitre.vn/thumb_w/1200/2022/12/11/capture-16706944477531596551845.jpg",
    verified: true,
    likes: 12,
    replies: []
},
{
    id: 2,
    name: "Leo Messi (10 Tạ)",
    text: "Trang web nhìn chuyên nghiệp thật ⚽",
    time: "26/03/2026 09:30",
    avatar: "https://www.thanglongwaterpuppet.org/wp-content/uploads/2025/10/anh-che-messi-va-chu-tich-fifa-mang-den-goc-nhin-hai-huoc-day-thu-vi.jpg",
    verified: true,
    likes: 8,
    replies: [
        {
            name: "Trịnh Trần Phương Tuấn",
            text: "Đóng MV với tui nha anh Messi",
            avatar: "teacher/jack.jpg"
        },
        {
            name: "Sơn Tùng M-TP",
            text: "10 giờ kém 7",
            avatar: "https://kenh14cdn.com/203336854389633024/2024/5/28/photo-1-17168606131071257137350.jpg"
        }
    ]
},
{
    id: 3,
    name: "Đoàn Văn Sáng",
    text: "Nhóm 5 đỉnh vậy các cháu ơi 😎",
    time: "26/03/2026 06:22",
    avatar: "https://i2-vnexpress.vnecdn.net/2025/12/03/settop-1764753857-7017-1764753869.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=gqM0j38ael1CYs95WEpQMw",
    verified: false,
    likes: 2,
    replies: []
},
{
    id: 4,
    name: "Độ Mixi",
    text: "Chưa tày đâu! ",
    time: "27/03/2026 14:29",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6gYiHAb6KJbLaQWHtutM9OXvZ859e1wNkCg&s",
    verified: true,
    likes: 18,
    replies: []
},
{
    id: 5,
    name: "Xuân Ngô",
    text: "Bạn Lê Giang cứ tiếp tục đi trễ như vậy, kì II cô hạ hạnh kiểm xuống khá",
    time: "26/03/2026 06:36",
    avatar: "teacher/xuan.jpg",
    verified: false,
    likes: 36,
    replies: []
}

];


// ===== RENDER =====
function renderComments()
{
    const list = document.getElementById("commentList");
    list.innerHTML = "";

    comments.forEach(c =>
    {
        list.innerHTML += `
        <div class="d-flex gap-3 mb-3">
            <img src="${c.avatar}" 
                 style="width:50px;height:50px;border-radius:50%;object-fit:cover;">
            <div class="bg-light p-2 rounded w-100">

                <strong>${c.name}</strong>
                ${c.verified ? '<img src="verified.png" class="verified-badge">' : ''}
                <small class="text-muted"> • ${c.time}</small>

                <div>${c.text}</div>

                <div class="mt-1">
                    <span onclick="likeComment(${c.id})" style="cursor:pointer">
                        ❤️ ${c.likes}
                    </span>
                    <span onclick="showReply(${c.id})" class="ms-3 text-primary" style="cursor:pointer">
                        Trả lời
                    </span>
                </div>

                <div id="replyBox-${c.id}" class="mt-2"></div>

                ${c.replies.map(r => `
                    <div class="d-flex gap-2 mt-2 ms-3">
                        <img src="${r.avatar}" 
                            style="width:32px;height:32px;border-radius:50%">
                        <div class="p-2 bg-white border rounded">
                            <strong>${r.name}</strong>: ${r.text}
                        </div>
                    </div>
                `).join("")}

            </div>
        </div>`;
    });
}


// ===== LIKE =====
function likeComment(id)
{
    const c = comments.find(x => x.id === id);
    c.likes++;
    renderComments();
}


// ===== REPLY =====
function showReply(id)
{
    const box = document.getElementById(`replyBox-${id}`);
    box.innerHTML = `
        <input id="replyInput-${id}" class="form-control mb-1" placeholder="Viết phản hồi...">
        <button class="btn btn-sm btn-danger" onclick="sendReply(${id})">Gửi</button>
    `;
}

function sendReply(id)
{
    if(!currentUser) return alert("Hãy đăng nhập");

    const text = document.getElementById(`replyInput-${id}`).value.trim();
    if(!text) return;

    const c = comments.find(x => x.id === id);
    c.replies.push({
        name: currentUser.name,
        text: text,
        avatar: currentUser.avatar
    });

    renderComments();
}


// ===== COMMENT MỚI =====
function addComment()
{
    if(!currentUser) return alert("Hãy đăng nhập");

    const text = document.getElementById("commentInput").value.trim();
    if(!text) return;

    comments.push({
        id: Date.now(),
        name: currentUser.name,
        text: text,
        time: new Date().toLocaleString(),
        avatar: currentUser.avatar,
        verified: false,
        likes: 0,
        replies: []
    });

    renderComments();
    document.getElementById("commentInput").value = "";
}


// ===== INIT =====
renderComments();