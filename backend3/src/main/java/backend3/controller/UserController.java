package backend3.controller;

import backend3.exception.InventoryNotFoundException;
import backend3.exception.UserNotFoundException;
import backend3.model.InventoryModel;
import backend3.model.UserModel;
import backend3.repository.InventoryRepository;
import backend3.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@CrossOrigin(origins = "*")

public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/user")
    public UserModel newUserModel(@RequestBody UserModel newUserModel) {
        return userRepository.save(newUserModel);
    }

    //user login
    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>>login(@RequestBody UserModel loginDetails){
        UserModel user = userRepository.findByEmail(loginDetails.getEmail())
                .orElseThrow(()->new UserNotFoundException("Email not found:"+loginDetails.getEmail()));

        //check the pw is matches
        if(user.getPassword().equals(loginDetails.getPassword())){
            Map<String,Object> response = new HashMap<>();
            response.put("massage","login Successfull");
            response.put("id",user.getId());// return user id
            response.put("roll", user.getRoll()); // Add user role to response
            return ResponseEntity.ok(response);

        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of( "message", "invalid credentials!"));
        }
    }

    //Display
    @GetMapping("/user")
    List<UserModel> getAllUsers(){return userRepository.findAll();}

    @GetMapping("/user/{id}")
    UserModel getUserId(@PathVariable Long id){
        return  userRepository.findById(id)
                .orElseThrow(()->new UserNotFoundException(id));
    }

    // Update user profile
    @PutMapping("/user/{id}")
    public ResponseEntity<UserModel> updateUser(@PathVariable Long id, @RequestBody UserModel updatedUser) {
        try {
            UserModel existingUser = userRepository.findById(id)
                    .orElseThrow(() -> new UserNotFoundException(id));
            
            // Update only the fields that are provided
            if (updatedUser.getFullname() != null) {
                existingUser.setFullname(updatedUser.getFullname());
            }
            if (updatedUser.getEmail() != null) {
                existingUser.setEmail(updatedUser.getEmail());
            }
            if (updatedUser.getPhone() != null) {
                existingUser.setPhone(updatedUser.getPhone());
            }
            if (updatedUser.getRoll() != null) {
                existingUser.setRoll(updatedUser.getRoll());
            }
            
            UserModel savedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(savedUser);
            
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //Delete
    @DeleteMapping("/user/{id}")
    String deleteItem(@PathVariable long id){
        //check item is exists db
        UserModel users = userRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id));

        //Delete item from the repo
        userRepository.deleteById(id);
        return "data with id"+id+"and image deleted";

        }
}
