package backend3.controller;

import backend3.exception.InventoryNotFoundException;
import backend3.model.InventoryModel;
import backend3.repository.InventoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    private final String UPLOAD_DIR = "src/main/uploads/";

    @PostMapping("/inventory")
    public InventoryModel newInventoryModel(@RequestBody InventoryModel newInventoryModel) {
        return inventoryRepository.save(newInventoryModel);
    }

    @PostMapping("/inventory/itemImg")
    public String itemImage(@RequestParam("file") MultipartFile file) {
        String itemImage = file.getOriginalFilename();

        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            file.transferTo(Paths.get(UPLOAD_DIR + itemImage));
        } catch (IOException e) {
            e.printStackTrace();
            return "Error uploading file: " + itemImage;
        }
        return itemImage;
    }

    @GetMapping("/inventory")
    public List<InventoryModel> getAllItems() {
        return inventoryRepository.findAll();
    }

    @GetMapping("/inventory/{id}")
    public InventoryModel getItemId(@PathVariable Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new InventoryNotFoundException(id));
    }

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }

    @PutMapping("/inventory/{id}")
    public InventoryModel updateItem(
            @RequestPart(value = "itemDetails") String itemDetails,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @PathVariable Long id) {

        System.out.println("Item Details: " + itemDetails);

        if (file != null) {
            System.out.println("File received: " + file.getOriginalFilename());
        } else {
            System.out.println("No file uploaded");
        }

        ObjectMapper mapper = new ObjectMapper();
        InventoryModel newInventory;

        try {
            newInventory = mapper.readValue(itemDetails, InventoryModel.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing itemDetails", e);
        }

        return inventoryRepository.findById(id).map(existingInventory -> {
            existingInventory.setItemId(newInventory.getItemId());
            existingInventory.setItemName(newInventory.getItemName());
            existingInventory.setItemQty(newInventory.getItemQty());
            existingInventory.setItemdescription(newInventory.getItemdescription());
            existingInventory.setItemdate(newInventory.getItemdate());
            existingInventory.setItemprice(newInventory.getItemprice());
            existingInventory.setItemCategory(newInventory.getItemCategory());

            if (file != null && !file.isEmpty()) {
                String itemImage = file.getOriginalFilename();
                try {
                    file.transferTo(Paths.get(UPLOAD_DIR + itemImage));
                    existingInventory.setItemImage(itemImage);
                } catch (IOException e) {
                    throw new RuntimeException("Error saving uploaded file", e);
                }
            }

            return inventoryRepository.save(existingInventory);

        }).orElseThrow(() -> new InventoryNotFoundException(id));
    }

    //Delete
    @DeleteMapping("/inventory/{id}")
    String deleteItem(@PathVariable long id){
        //check item is exists db
        InventoryModel inventorItem = inventoryRepository.findById(id)
                .orElseThrow(()-> new InventoryNotFoundException(id));
        //img delete part
        String itemImage = inventorItem.getItemImage();
        if(itemImage != null && !itemImage.isEmpty()){
            File imageFile = new File("src/main/uploads"+itemImage);
            if(imageFile.exists()){
                if(imageFile.delete()){
                    System.out.println("Image Deleted");
                }else{
                    System.out.println("failed Image Delete");
                }
            }
        }
        //Delete item from the repo
        inventoryRepository.deleteById(id);
        return "data with id"+id+"and image deleted";
    }
}
