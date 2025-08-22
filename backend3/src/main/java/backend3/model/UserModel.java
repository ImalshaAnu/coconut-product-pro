package backend3.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity

public class UserModel {
    @Id
    @GeneratedValue
    private long id;
    private String fullname;
    private String email;
    private String password;
    private String Phone;
    private String roll;

    public UserModel(){

    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return Phone;
    }

    public void setPhone(String phone) {
        Phone = phone;
    }

    public String getRoll() {
        return roll;
    }

    public void setRoll(String roll) {
        this.roll = roll;
    }

    public UserModel(long id, String fullname, String email, String password, String phone, String roll) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        Phone = phone;
        this.roll = roll;
    }
}
