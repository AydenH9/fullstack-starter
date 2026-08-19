package com.starter.fullstack.dao;

import com.starter.fullstack.api.Inventory;
import java.util.List;
import java.util.Optional;
import javax.annotation.Resource;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.utility.DockerImageName;

/**
 * Test Inventory DAO.
 */
@DataMongoTest
@RunWith(SpringRunner.class)
public class InventoryDAOTest {
  @ClassRule
  public static final MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:4.0.10"));

  @Resource
  private MongoTemplate mongoTemplate;
  private InventoryDAO inventoryDAO;
  private static final String NAME = "Amber";
  private static final String PRODUCT_TYPE = "hops";

  @Before
  public void setup() {
    this.inventoryDAO = new InventoryDAO(this.mongoTemplate);
  }

  @After
  public void tearDown() {
    this.mongoTemplate.dropCollection(Inventory.class);
  }

  /**
   * Test Find All method.
   */
  @Test
  public void findAll() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    this.mongoTemplate.save(inventory);
    List<Inventory> actualInventory = this.inventoryDAO.findAll();
    Assert.assertFalse(actualInventory.isEmpty());
  }

  /**
   * Test Create method.
   */
  @Test
  public void create() {
    Inventory inventory = new Inventory();
    inventory.setId("existing-id");
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    Inventory actualInventory = this.inventoryDAO.create(inventory);
    Assert.assertNotNull(actualInventory);
    Assert.assertNotNull(actualInventory.getId());
    Assert.assertNotEquals("existing-id", actualInventory.getId());
    Assert.assertEquals(NAME, actualInventory.getName());
    Assert.assertEquals(PRODUCT_TYPE, actualInventory.getProductType());
    Inventory savedInventory = this.mongoTemplate.findById(actualInventory.getId(), Inventory.class);
    Assert.assertNotNull(savedInventory);
    Assert.assertEquals(NAME, savedInventory.getName());
    Assert.assertEquals(PRODUCT_TYPE, savedInventory.getProductType());
  }

  /**
   * Test Update method.
   */
  @Test
  public void update() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    inventory = this.mongoTemplate.save(inventory);
    String inventoryId = inventory.getId();
    inventory.setName("Updated Amber");

    Optional<Inventory> updatedInventory = this.inventoryDAO.update(inventoryId, inventory);

    Assert.assertTrue(updatedInventory.isPresent());
    Assert.assertEquals(inventoryId, updatedInventory.get().getId());
    Assert.assertEquals("Updated Amber", updatedInventory.get().getName());
    Assert.assertEquals(1, this.mongoTemplate.findAll(Inventory.class).size());
  }

  /**
   * Test Update method with an invalid ID.
   */
  @Test
  public void updateNotFound() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);

    Assert.assertFalse(this.inventoryDAO.update("INVALID ID", inventory).isPresent());
  }

  /**
   * Test Delete method.
   */
  @Test
  public void delete() {
    Inventory inventory = new Inventory();
    inventory.setName(NAME);
    inventory.setProductType(PRODUCT_TYPE);
    inventory = this.mongoTemplate.save(inventory);
    Optional<Inventory> deletedInventory =
        this.inventoryDAO.delete(inventory.getId());
    Assert.assertTrue(deletedInventory.isPresent());
    Assert.assertEquals(inventory.getId(), deletedInventory.get().getId());
    Inventory actualInventory =
        this.mongoTemplate.findById(inventory.getId(), Inventory.class);
    Assert.assertNull(actualInventory);
  }

  /**
   * Test Delete method with an invalid ID.
   */
  @Test
  public void deleteNotFound() {
    Optional<Inventory> deletedInventory =
        this.inventoryDAO.delete("INVALID ID");
    Assert.assertFalse(deletedInventory.isPresent());
  }
}
