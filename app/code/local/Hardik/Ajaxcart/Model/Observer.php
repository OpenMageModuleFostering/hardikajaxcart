<?php

class Hardik_Ajaxcart_Model_Observer
{

    public function addToCartEvent($observer)
    {

        $request = Mage::app()->getFrontController()->getRequest();

        if (!$request->getParam('in_cart') && !$request->getParam('is_checkout')) {

            Mage::getSingleton('checkout/session')->setNoCartRedirect(true);

            $_response = Mage::getModel('ajaxcart/response')
                ->setProductName($observer->getProduct()->getName())
                ->setMessage(Mage::helper('checkout')->__('%s was added into cart.', $observer->getProduct()->getName()));

            //append updated blocks
            $_response->addUpdatedBlocks($_response);

            $_response->send();
        }
        if ($request->getParam('is_checkout')) {

            Mage::getSingleton('checkout/session')->setNoCartRedirect(true);

            $_response = Mage::getModel('ajaxcart/response')
                ->setProductName($observer->getProduct()->getName())
                ->setMessage(Mage::helper('checkout')->__('%s was added into cart.', $observer->getProduct()->getName()));
            $_response->send();
        }
    }

    public function updateItemEvent($observer)
    {

        $request = Mage::app()->getFrontController()->getRequest();

        if (!$request->getParam('in_cart') && !$request->getParam('is_checkout')) {

            Mage::getSingleton('checkout/session')->setNoCartRedirect(true);

            $_response = Mage::getModel('ajaxcart/response')
                ->setMessage(Mage::helper('checkout')->__('Item was updated.'));

            //append updated blocks
            $_response->addUpdatedBlocks($_response);

            $_response->send();
        }
        if ($request->getParam('is_checkout')) {

            Mage::getSingleton('checkout/session')->setNoCartRedirect(true);

            $_response = Mage::getModel('ajaxcart/response')
                ->setMessage(Mage::helper('checkout')->__('Item was updated.'));
            $_response->send();
        }
    }
}