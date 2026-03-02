package com.ecommerce.error;

public class CustomException extends RuntimeException{

    private int httpStatus;

    public CustomException(){
        super("Error in Auth-Service  ");
    }

    public CustomException(String msg){
        super(msg);
    }

    public CustomException(String msg, int httpStatus){
        super(msg);
        this.httpStatus=httpStatus;
    }

    public int getHttpStatus(){
        return httpStatus;
    }

}
