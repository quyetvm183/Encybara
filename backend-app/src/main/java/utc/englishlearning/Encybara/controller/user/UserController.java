package utc.englishlearning.Encybara.controller.user;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import utc.englishlearning.Encybara.domain.User;
import utc.englishlearning.Encybara.domain.response.auth.ResCreateUserDTO;
import utc.englishlearning.Encybara.domain.response.ResUpdateUserDTO;
import utc.englishlearning.Encybara.domain.response.ResUserDTO;
import utc.englishlearning.Encybara.domain.response.ResultPaginationDTO;
import utc.englishlearning.Encybara.exception.FileStorageException;
import utc.englishlearning.Encybara.exception.IdInvalidException;
import utc.englishlearning.Encybara.service.FileStorageService;
import utc.englishlearning.Encybara.service.UserService;
import utc.englishlearning.Encybara.util.annotation.ApiMessage;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    public UserController(UserService userService, PasswordEncoder passwordEncoder,
            FileStorageService fileStorageService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/users")
    @ApiMessage("Create a new user")
    public ResponseEntity<ResCreateUserDTO> createNewUser(@Valid @RequestBody User postManUser)
            throws IdInvalidException {
        boolean isEmailExist = this.userService.isEmailExist(postManUser.getEmail());
        if (isEmailExist) {
            throw new IdInvalidException(
                    "Email " + postManUser.getEmail() + "đã tồn tại, vui lòng sử dụng email khác.");
        }

        String hashPassword = this.passwordEncoder.encode(postManUser.getPassword());
        postManUser.setPassword(hashPassword);
        User ericUser = this.userService.handleCreateUser(postManUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.convertToResCreateUserDTO(ericUser));
    }

    @DeleteMapping("/users/{id}")
    @ApiMessage("Delete a user")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") long id)
            throws IdInvalidException {
        User currentUser = this.userService.fetchUserById(id);
        if (currentUser == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }

        this.userService.handleDeleteUser(id);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/users/{id}")
    @ApiMessage("fetch user by id")
    public ResponseEntity<ResUserDTO> getUserById(@PathVariable("id") long id) throws IdInvalidException {
        User fetchUser = this.userService.fetchUserById(id);
        if (fetchUser == null) {
            throw new IdInvalidException("User với id = " + id + " không tồn tại");
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(this.userService.convertToResUserDTO(fetchUser));
    }

    @GetMapping("/users")
    @ApiMessage("fetch all users")
    public ResponseEntity<ResultPaginationDTO> getAllUser(
            @Filter Specification<User> spec,
            Pageable pageable) {

        return ResponseEntity.status(HttpStatus.OK).body(
                this.userService.fetchAllUser(spec, pageable));
    }

    @PutMapping("/users")
    @ApiMessage("Update a user")
    public ResponseEntity<ResUpdateUserDTO> updateUser(@RequestBody User user) throws IdInvalidException {
        User ericUser = this.userService.handleUpdateUser(user);
        if (ericUser == null) {
            throw new IdInvalidException("User với id = " + user.getId() + " không tồn tại");
        }
        return ResponseEntity.ok(this.userService.convertToResUpdateUserDTO(ericUser));
    }

    @PostMapping(value = "/users/{userId}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Upload user avatar")
    public ResponseEntity<ResUserDTO> uploadAvatar(
            @PathVariable("userId") Long userId,
            @RequestParam("file") MultipartFile file) throws IdInvalidException {

        if (file == null || file.isEmpty()) {
            throw new FileStorageException("File không được để trống");
        }

        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new FileStorageException("Chỉ chấp nhận file hình ảnh");
        }

        // Check file size (e.g., limit to 4MB)
        if (file.getSize() > 4 * 1024 * 1024) {
            throw new FileStorageException("Kích thước file không được vượt quá 4MB");
        }

        // Store the file and get direct material link (URL)
        String avatarUrl = this.fileStorageService.storeAvatar(file);

        // Update user's avatar URL in DB and handle old avatar deletion
        User updatedUser = this.userService.updateUserAvatar(userId, avatarUrl);

        // Return updated user info
        return ResponseEntity.ok(this.userService.convertToResUserDTO(updatedUser));
    }
}
