package backend3.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class InventoryModel {
    @Id
    @GeneratedValue
    private long id;
    private String itemId;
    private String itemImage;
    private String itemName;
    private String itemQty;
    private String itemdescription;
    private String itemdate;
    private String itemprice;
    private String itemCategory;



    public InventoryModel(){

    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getItemImage() {
        return itemImage;
    }

    public void setItemImage(String itemImage) {
        this.itemImage = itemImage;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getItemQty() {
        return itemQty;
    }

    public void setItemQty(String itemQty) {
        this.itemQty = itemQty;
    }

    public String getItemdescription() {
        return itemdescription;
    }

    public void setItemdescription(String itemdescription) {
        this.itemdescription = itemdescription;
    }

    public String getItemdate() {
        return itemdate;
    }

    public void setItemdate(String itemdate) {
        this.itemdate = itemdate;
    }

    public String getItemprice() {
        return itemprice;
    }

    public void setItemprice(String itemprice) {
        this.itemprice = itemprice;
    }
    public String getItemCategory() {
        return itemCategory;
    }

    public void setItemCategory(String itemCategory) {
        this.itemCategory = itemCategory;
    }

    public InventoryModel(long id, String itemId, String itemImage, String itemName, String itemQty, String itemdescription, String itemdate, String itemprice, String itemCategory) {
        this.id = id;
        this.itemId = itemId;
        this.itemImage = itemImage;
        this.itemName = itemName;
        this.itemQty = itemQty;
        this.itemdescription = itemdescription;
        this.itemdate = itemdate;
        this.itemprice = itemprice;
        this.itemCategory=itemCategory;
    }
}
