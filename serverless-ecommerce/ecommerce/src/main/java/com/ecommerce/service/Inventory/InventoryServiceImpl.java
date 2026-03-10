package com.ecommerce.service.Inventory;


import com.ecommerce.dto.order.OrderItem;
import com.ecommerce.error.CustomException;
import com.ecommerce.modal.Inventory;
import com.ecommerce.repo.InventoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class InventoryServiceImpl implements InventoryService{

    @Autowired
    private InventoryRepo inventoryRepo;


    @Override
    public String saveProductInSTOCK(String productId, int stock) {
        Inventory inventory = new Inventory();
        inventory.setId(UUID.randomUUID().toString().substring(0, 6));

        inventory.setProductId(productId);
        inventory.setQuantity(stock);
        //save
        Inventory inv =  inventoryRepo.save(inventory);
        return inv.getProductId();
    }

    @Override
    public int getItemQuantity(String stock) {
       return inventoryRepo.findByProductId(stock)
                .map(Inventory::getQuantity)
                .orElseThrow(()->new CustomException("No data "));
    }



    @Override
    public void checkAndReduceSTOCK(List<OrderItem> items) {
        //check and reduce the stock
        for (OrderItem item : items) {

         Inventory inventory =  inventoryRepo.findByProductId(item.getProductId())
                 .orElseThrow(()->new CustomException("No data"));


         if(inventory.getQuantity() < item.getQuantity()){
             throw new CustomException("Insufficient stock for product");
         }

         inventory.setQuantity(inventory.getQuantity() - item.getQuantity());

         inventoryRepo.save(inventory);

        }

    }


    @Override
    public void deleteByID(String stock) {
        Inventory inventory = inventoryRepo.findByProductId(stock)
                .orElseThrow(()->new CustomException("No data "));

        inventoryRepo.deleteInventory(inventory);

    }


}
