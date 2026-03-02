package com.ecommerce.dto.order;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShippingAddress {

    private String street;
    private String city;
    private String state;
    private String zipCode;


}
