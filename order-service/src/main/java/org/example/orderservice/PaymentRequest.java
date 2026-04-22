package org.example.orderservice;

import lombok.Data;

@Data
public class PaymentRequest {
    private String status;         // PAID, CANCELLED
    private String paymentMethod;  // COD, BANKING
}
