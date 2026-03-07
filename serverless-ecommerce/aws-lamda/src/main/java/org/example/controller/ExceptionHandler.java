package org.example.controller;


import org.example.dto.ErrorDTO;
import org.example.error.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionHandler {


    @org.springframework.web.bind.annotation.ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorDTO> handelException(CustomException exception){
        ErrorDTO dto = new ErrorDTO();
        dto.setFlag(false);
        dto.setMsg(exception.getMessage());
        dto.setHttpStatus(exception.getHttpStatus());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(dto);
    }


}
