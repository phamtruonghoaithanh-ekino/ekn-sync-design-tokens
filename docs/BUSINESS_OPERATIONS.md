Chúng tôi mong muốn xây dựng một quy trình tự động hóa Design Token nhằm cho phép các quyết định thiết kế được định nghĩa trong Figma có thể được sử dụng trực tiếp bởi đội ngũ phát triển.

Figma sẽ đóng vai trò là **nguồn dữ liệu duy nhất (Single Source of Truth)** cho toàn bộ Design Tokens. Người dùng không được chỉnh sửa trực tiếp file `tokens.json` trong repository. Mọi thay đổi về token như thêm, xoá, sửa Set, Theme hoặc Token Value phải được thực hiện thông qua Figma Plugin.

Repository chỉ đóng vai trò là nơi lưu trữ, version control và chạy CI/CD để transform `tokens.json` thành các output dùng cho development, ví dụ như CSS Variables. Nếu có thay đổi trực tiếp trên `tokens.json` từ repository mà không xuất phát từ Figma Plugin, hệ thống cần xem đó là thay đổi không hợp lệ hoặc potential conflict. Trong trường hợp này, Plugin cần cảnh báo người dùng trước khi Sync.

Quy tắc chính:

- Figma Plugin là nơi quản lý token.
- Git repository là nơi lưu trữ và review thay đổi.
- CI/CD là nơi build output.
- Không chỉnh sửa token thủ công trực tiếp trong repository.

Người dùng sử dụng Figma Plugin để tạo và đóng góp không giới hạn các loại token như color, spacing, border, border radius, typography, shadow… Plugin hỗ trợ hai trạng thái làm việc: **local changes** và **connected with provider**.

Người dùng có thể thêm, xoá, sửa Set (bộ token). Khi tạo hoặc chỉnh sửa token, Plugin sẽ hiển thị dialog phù hợp với từng Token Type để người dùng nhập đúng cấu trúc dữ liệu cần thiết.

### Token Validation

Hệ thống phải thực hiện validation ngay tại thời điểm người dùng tạo hoặc chỉnh sửa token trong Figma Plugin, cụ thể là trong dialog **Add/Edit Token**.

Mục tiêu là đảm bảo token không hợp lệ sẽ không thể được lưu vào plugin state và không thể được đồng bộ lên repository.

Plugin cần kiểm tra:

- Token name không được để trống.
- Token name phải là duy nhất trong cùng phạm vi Set.
- Không được tạo circular reference giữa các token.
- Không được xoá token đang được tham chiếu bởi token hoặc theme khác.

Nếu token không hợp lệ, Plugin cần hiển thị lỗi rõ ràng ngay trong dialog và không cho phép người dùng lưu token đó.

Vì validation được xử lý tại bước Add/Edit Token, hệ thống không có trường hợp token sai được thêm vào danh sách token.

Button Sync chỉ được enable khi:

- Không có validation error trong token hiện tại.
- Không có theme reference error.
- Không có conflict giữa local changes và provider version.

### Set, Theme và Token Management

Người dùng có thể tạo Theme dựa trên danh sách các Set đã có. Theme sẽ đại diện cho một nhóm token được sử dụng trong một context cụ thể, ví dụ: light theme, dark theme, brand theme hoặc project theme.

Plugin cần hỗ trợ các chức năng quản lý token cơ bản:

- Search token theo name hoặc value.
- Ẩn những Token Type không có value.
- Thêm, xoá, sửa token.
- Thêm, xoá, sửa Set.
- Tạo và chỉnh sửa Theme dựa trên danh sách Set.

### Export và Provider Sync

Người dùng có thể export file `tokens.json` thủ công hoặc sync `tokens.json` trực tiếp tới Git provider.

Plugin sẽ có Settings section cho phép người dùng kết nối tới GitHub hoặc GitLab provider. Người dùng cần cung cấp:

- Personal Access Token (PAT).
- Repository URL.
- Target branch.
- Provider type: GitHub hoặc GitLab.

Plugin cần cung cấp option **Test Connection** để kiểm tra thông tin kết nối trước khi thực hiện Sync.

### Sync Preview

Plugin sẽ có Sync section cho phép người dùng kiểm tra các thay đổi trước khi đồng bộ lên provider.

Sync Preview cần hiển thị rõ:

- Token nào được thêm.
- Token nào bị xoá.
- Token nào được chỉnh sửa.
- Token thuộc Set nào.
- Giá trị cũ và giá trị mới đối với token bị chỉnh sửa.

Ví dụ:

```
Modified

Set: global
Token: color.primary
Old value: #000000
New value: #FF0000
```

### Initial Sync from Provider

Khi người dùng mở Figma Plugin và plugin đã được kết nối với Git provider, hệ thống cần tự động tải phiên bản `tokens.json` mới nhất từ provider về để đảm bảo dữ liệu trong plugin luôn được cập nhật theo repository.

Plugin cần kiểm tra:

- Provider connection còn hợp lệ.
- Repository URL, target branch và file `tokens.json` có tồn tại.
- Phiên bản `tokens.json` trên provider có khác với dữ liệu hiện tại trong plugin hay không.

Nếu người dùng **không có local changes**, plugin sẽ tự động cập nhật dữ liệu token theo phiên bản mới nhất từ provider.

Nếu người dùng **đang có local changes**, plugin không được ghi đè trực tiếp dữ liệu local. Thay vào đó, hệ thống cần compare giữa:

- Local token changes trong plugin.
- Phiên bản `tokens.json` mới nhất từ provider.

Kết quả compare cần được cập nhật vào **Sync section** để UI hiển thị rõ:

- Token nào đang được thêm ở local.
- Token nào đang bị xoá ở local.
- Token nào đang được chỉnh sửa ở local.
- Token nào đã bị thay đổi từ provider.
- Token nào đã bị xoá từ provider.
- Token nào có potential conflict giữa local changes và provider version.

Nếu phát hiện conflict, plugin cần cảnh báo người dùng trước khi Sync và không được tự động ghi đè dữ liệu local hoặc provider.

Expected behavior:

- Khi mở plugin: tự động fetch latest `tokens.json` từ provider.
- Nếu không có local changes: cập nhật plugin theo provider version.
- Nếu có local changes: compare local changes với provider version.
- Sync section phải hiển thị đầy đủ diff giữa local và provider.
- Nếu token bị remove hoặc thay đổi từ provider trong khi local cũng đang chỉnh sửa token đó: đánh dấu là potential conflict.
- Không cho phép Sync nếu conflict chưa được xử lý.

### Sync to Provider

Khi người dùng click button Sync, hệ thống sẽ dựa vào provider config để commit thay đổi `tokens.json` và tạo Merge Request vào target branch đã được cấu hình.

Trước khi Sync, hệ thống cần kiểm tra:

- Provider connection còn hợp lệ.
- Không tồn tại validation error.
- Nội dung `tokens.json` có thay đổi so với version hiện tại.
- Không có conflict không thể resolve với target branch.

### Conflict Handling & Pending Merge Request

Khi người dùng thực hiện Sync token từ Figma Plugin lên Git provider, hệ thống cần kiểm tra xem đã tồn tại Merge Request đang mở cho cùng repository, target branch và file `tokens.json` hay chưa.

Nếu chưa có Merge Request đang mở, hệ thống sẽ tạo một branch mới và tạo Merge Request mới vào target branch đã được cấu hình.

Nếu đã tồn tại Merge Request đang mở, hệ thống sẽ không tạo Merge Request mới. Thay vào đó, hệ thống sẽ cập nhật lại branch hiện tại của Merge Request đó bằng cách rebase với target branch mới nhất, sau đó commit thêm các thay đổi token mới vào cùng branch.

Mỗi lần Sync vẫn phải được lưu thành một commit riêng biệt để đảm bảo có thể theo dõi lịch sử thay đổi token theo từng lần đồng bộ.

Merge Request hiện tại sẽ được cập nhật tự động với commit mới, giúp reviewer có thể xem toàn bộ lịch sử thay đổi trong cùng một MR thay vì phải review nhiều MR riêng lẻ.

Trong trường hợp quá trình rebase phát sinh conflict với target branch, hệ thống cần dừng quá trình Sync và hiển thị thông báo lỗi rõ ràng cho người dùng. Người dùng cần xử lý conflict hoặc merge/close Merge Request hiện tại trước khi thực hiện Sync lại.

Expected behavior:

- Nếu chưa có MR đang mở: tạo branch mới và tạo MR mới.
- Nếu đã có MR đang mở: rebase branch hiện tại với target branch mới nhất.
- Sau khi rebase thành công: commit thêm thay đổi mới vào cùng branch.
- Mỗi lần Sync tương ứng với một commit riêng.
- Không tạo nhiều MR cho cùng một nhóm thay đổi token.
- Nếu rebase conflict: dừng Sync và thông báo lỗi cho người dùng.

### Repository và CI/CD

Repository chứa token sẽ có cấu trúc tối thiểu như sau:

```
repo
├── tokens.json
├── style-dictionary.config.js
└── build
    └── variables.css
```

Khi file `tokens.json` thay đổi, CI/CD pipeline sẽ tự động chạy command build Style Dictionary để transform token thành CSS Variables.

Output chính của pipeline là file `variables.css` trong thư mục `build`.

CI/CD cần đảm bảo:

- Chỉ chạy build khi `tokens.json` hoặc config liên quan thay đổi.
- Build fail nếu Style Dictionary không thể transform token.
- File output được generate theo naming convention đã thống nhất.
- Developer có thể sử dụng token thông qua CSS Variables.

Ví dụ output:

```css
:root {
  --color-primary: #0460a9;
  --spacing-sm: 8px;
  --border-radius-md: 4px;
}
```

Developer sử dụng trong code:
